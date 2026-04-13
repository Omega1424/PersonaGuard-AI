import { useState, useCallback, useEffect } from "react";
import { chatAPI } from "../services/api";

function useChat() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isBackendReady, setIsBackendReady] = useState(false);
  const [currentPersona, setCurrentPersona] = useState('ahbeng');

  const sendMessage = useCallback(
    async (messageText) => {
      if (!messageText.trim() || isLoading) return;

      // Add user message to messages
      const userMessage = {
        role: "user",
        content: messageText.trim(),
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      try {
        // Get conversation history for API call
        const conversationHistory = messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

        // Send message to backend with persona
        const response = await chatAPI.sendMessage(
          messageText,
          conversationHistory,
          currentPersona
        );

        console.log("API Response:", response);

        // Add bot response to messages
        const botMessage = {
          role: "assistant",
          content: response.response,
          safety: response.safety,
          timestamp: response.timestamp,
        };

        console.log(botMessage);

        setMessages((prev) => [...prev, botMessage]);
      } catch (err) {
        console.error("Failed to send message:", err);

        // Create error message
        let errorMessage = "Sorry, something went wrong. Please try again.";

        if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.code === "ECONNABORTED") {
          errorMessage =
            "Request timeout. The server might be busy, please try again.";
        } else if (err.code === "NETWORK_ERROR") {
          errorMessage =
            "Network error. Please check your connection and try again.";
        }

        const errorBotMessage = {
          role: "assistant",
          content: errorMessage,
          timestamp: new Date().toISOString(),
          isError: true,
        };

        setMessages((prev) => [...prev, errorBotMessage]);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading, currentPersona]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
    setInputMessage('');
  }, []);

  const retryLastMessage = useCallback(() => {
    if (messages.length >= 2) {
      const lastUserMessage = messages[messages.length - 2];
      if (lastUserMessage.role === "user") {
        // Remove the last failed bot message
        setMessages((prev) => prev.slice(0, -1));
        // Resend the user message
        sendMessage(lastUserMessage.content);
      }
    }
  }, [messages, sendMessage]);

  // Run health check on mount and retry if needed
  useEffect(() => {
    let timeoutId;
    let attemptCount = 0;
    let isActive = true;

    const performHealthCheck = async () => {
      if (!isActive) return;

      try {
        attemptCount++;
        console.log(`Checking backend health (attempt ${attemptCount})...`);

        await chatAPI.healthCheck();

        console.log("Backend is ready!");
        setIsBackendReady(true);
      } catch (err) {
        console.error("Backend health check failed:", err);

        if (isActive) {
          // Retry with exponential backoff (max 30 seconds)
          const retryDelay = Math.min(3000 * Math.pow(1.5, attemptCount - 1), 30000);
          console.log(`Retrying health check in ${retryDelay / 1000}s...`);

          timeoutId = setTimeout(performHealthCheck, retryDelay);
        }
      }
    };

    performHealthCheck();

    return () => {
      isActive = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []); // Empty dependency array - only run once on mount

  return {
    messages,
    inputMessage,
    setInputMessage,
    sendMessage,
    clearMessages,
    retryLastMessage,
    isLoading,
    error,
    isBackendReady,
    currentPersona,
    setCurrentPersona,
  };
}

export default useChat;
