import React, { useEffect, useRef, useState } from 'react'
import MessageBubble from './MessageBubble'

function ChatWindow({
  messages,
  inputMessage,
  setInputMessage,
  sendMessage,
  isLoading,
  isBackendReady = true,
  currentPersona = "default"
}) {
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [inputMessage])

  const handleSend = () => {
    if (!inputMessage.trim()) return
    sendMessage(inputMessage.trim())
    setInputMessage('')
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const getPersonaMeta = () => {
    switch(currentPersona) {
      case 'ahbeng':
        return {
          label: 'Job Scam',
          title: 'Ah Beng — Job Scam Simulator',
          description: 'The AI will play a job scammer using urgency and familiarity to lure you. Engage with the persona and try to spot the red flags before it\'s too late.',
          prompts: [
            "Tell me more about this job offer",
            "How much can I earn per day?",
            "What tasks do I need to do?",
            "Is this a registered company?",
            "Why contact me on WhatsApp?",
            "I'm not sure, can I verify first?"
          ]
        }
      case 'xmm':
        return {
          label: 'Love Scam',
          title: 'XMM — Love Scam Simulator',
          description: 'The AI will play a love scammer who builds emotional trust and then exploits it. Engage with the persona and try to identify isolation and manipulation tactics.',
          prompts: [
            "How did you find my number?",
            "Tell me more about yourself",
            "Are you who you say you are?",
            "Why are you messaging me?",
            "I feel like we have a connection",
            "Can we video call sometime?"
          ]
        }
      case 'nsf':
        return {
          label: 'Police Impersonation',
          title: 'SPF Officer — Police Impersonation Simulator',
          description: 'The AI will impersonate an SPF officer claiming your identity is linked to a crime. Engage with the persona and spot how fear and urgency are used to pressure you into transferring money.',
          prompts: [
            "What crime am I involved in?",
            "Can I call SPF to verify this?",
            "Why can't I tell my family?",
            "I've done nothing wrong",
            "Why do I need to transfer money?",
            "Let me speak to your superior"
          ]
        }
      default: // singlish / phishing
        return {
          label: 'Phishing',
          title: 'Phishing Simulator',
          description: 'The AI will send phishing messages that mimic real services like banks, Singpass, or delivery companies. Engage to learn how to spot fake links and credential theft tactics.',
          prompts: [
            "I got a link saying my account is suspended",
            "This message says I have a parcel to collect",
            "It says I need to verify my Singpass",
            "Should I click this link?",
            "Why is it asking for my OTP?",
            "This looks like it's from my bank"
          ]
        }
    }
  }

  const meta = getPersonaMeta()

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8f5ff] dark:bg-[#0d0521]">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {!isBackendReady ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-700 to-pink-600 rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-purple-900/50 animate-pulse">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-purple-900 dark:text-white mb-2">Initialising PersonaGuard AI...</h2>
            <p className="text-purple-500/70 dark:text-purple-300/70 mb-6 max-w-md">
              The backend server is starting up. This may take a moment if it was inactive.
            </p>
            <div className="flex items-center space-x-2 text-sm text-purple-500/60 dark:text-purple-400/60">
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              <span className="ml-2">Connecting to backend...</span>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-700 to-pink-600 rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-purple-900/50">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>

            <span className="px-3 py-1 bg-pink-200/50 dark:bg-pink-500/20 border border-pink-400/40 text-pink-600 dark:text-pink-300 text-xs font-semibold rounded-full mb-3 uppercase tracking-wide">
              {meta.label}
            </span>

            <h2 className="text-xl font-semibold text-purple-900 dark:text-white mb-2">
              {meta.title}
            </h2>
            <p className="text-purple-500/70 dark:text-purple-300/70 mb-6 max-w-md text-sm leading-relaxed">
              {meta.description}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl">
              {meta.prompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(prompt)}
                  className="px-4 py-3 bg-purple-100/60 dark:bg-purple-950/60 border border-purple-300/50 dark:border-purple-800/50 text-purple-700 dark:text-purple-200 rounded-xl hover:bg-purple-200/50 dark:hover:bg-purple-900/50 hover:border-purple-400/60 dark:hover:border-purple-600/60 hover:text-purple-900 dark:hover:text-white transition-colors duration-200 text-sm text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              >
                <MessageBubble
                  message={message.content}
                  isUser={message.role === 'user'}
                  safety={message.safety}
                />
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-purple-100 dark:bg-[#1e0a4c] border border-purple-300/40 dark:border-purple-800/40 px-4 py-3 rounded-2xl rounded-bl-sm shadow-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-purple-200/50 dark:border-purple-900/50 bg-purple-50 dark:bg-[#120b2e] px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={!isBackendReady ? "Waiting for backend to start..." : `Reply to the ${meta.label} persona...`}
              disabled={!isBackendReady}
              rows={1}
              className="w-full px-4 py-3 bg-white dark:bg-purple-950/60 border border-purple-300/40 dark:border-purple-800/40 text-purple-900 dark:text-white rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 placeholder-purple-400/60 dark:placeholder-purple-500/60 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                minHeight: '48px',
                maxHeight: '120px',
              }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!inputMessage.trim() || isLoading || !isBackendReady}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-2xl hover:from-purple-500 hover:to-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-purple-900/50 flex items-center justify-center"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18-9-2 9z" />
            </svg>
          </button>
        </div>

        {/* Quick prompts below input (shown when no messages) */}
        {messages.length === 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {meta.prompts.slice(0, 4).map((prompt, index) => (
              <button
                key={index}
                onClick={() => setInputMessage(prompt)}
                className="px-3 py-1.5 bg-purple-100/50 dark:bg-purple-950/50 border border-purple-300/40 dark:border-purple-800/40 text-purple-600 dark:text-purple-300 rounded-lg text-xs hover:bg-purple-200/40 dark:hover:bg-purple-900/40 hover:text-purple-900 dark:hover:text-white hover:border-purple-400/60 dark:hover:border-purple-700/60 transition-colors duration-200"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

export default ChatWindow
