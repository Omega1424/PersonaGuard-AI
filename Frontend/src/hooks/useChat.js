import { useState, useCallback, useEffect, useRef } from 'react'
import { chatAPI, sessionAPI, userAPI } from '../services/api'

const USER_ID_KEY = 'personaguard_user_id'
const MAX_USER_MESSAGES = 30

// ─── Conversation state machine ───────────────────────────────────────────────
// IDLE → AWARENESS_CHECK → GROUND_RULES → CHATTING → GUESS_PROMPT → REVEAL → COMPLETE

function getUserId() {
  let id = localStorage.getItem(USER_ID_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(USER_ID_KEY, id)
  }
  return id
}

function useChat() {
  const [userId] = useState(getUserId)
  const [currentPersona, setCurrentPersona] = useState('ahbeng')
  const [convState, setConvState] = useState('IDLE')
  const [messages, setMessages] = useState([])       // chat messages only
  const [sessionId, setSessionId] = useState(null)
  const [messageCount, setMessageCount] = useState(0) // user messages sent
  const [isLoading, setIsLoading] = useState(false)
  const [isBackendReady, setIsBackendReady] = useState(false)
  const [inputMessage, setInputMessage] = useState('')
  const [revealData, setRevealData] = useState(null)  // result of /reveal
  const [moduleCompleted, setModuleCompleted] = useState(false)
  const [userStats, setUserStats] = useState(null)

  const healthRetryRef = useRef(null)

  // ── Backend health check on mount ─────────────────────────────────────────
  useEffect(() => {
    let attempt = 0
    let active = true

    const check = async () => {
      if (!active) return
      try {
        await chatAPI.healthCheck()
        setIsBackendReady(true)
        // Init user record
        const user = await userAPI.init(userId)
        setModuleCompleted(Boolean(user.module_completed))
      } catch {
        attempt++
        const delay = Math.min(3000 * Math.pow(1.5, attempt - 1), 30000)
        if (active) healthRetryRef.current = setTimeout(check, delay)
      }
    }

    check()
    return () => {
      active = false
      if (healthRetryRef.current) clearTimeout(healthRetryRef.current)
    }
  }, [userId])

  // ── Start a new conversation (persona selected or New Simulation clicked) ──
  const startConversation = useCallback(() => {
    setMessages([])
    setSessionId(null)
    setMessageCount(0)
    setRevealData(null)
    setInputMessage('')
    setConvState('AWARENESS_CHECK')
  }, [])

  // Called when user selects a different persona
  const handlePersonaChange = useCallback((personaId) => {
    setCurrentPersona(personaId)
    setMessages([])
    setSessionId(null)
    setMessageCount(0)
    setRevealData(null)
    setInputMessage('')
    setConvState('IDLE')
  }, [])

  // ── Step A: User answers awareness check ──────────────────────────────────
  const answerAwareness = useCallback(
    async (answered) => {
      // answered: true = "Yes", false = "No"
      setConvState('GROUND_RULES')

      // Auto-advance to CHATTING after 4 seconds
      setTimeout(async () => {
        setConvState('CHATTING')
        setIsLoading(true)
        try {
          const { session_id, first_message } = await sessionAPI.start(
            userId,
            currentPersona,
            answered
          )
          setSessionId(session_id)
          setMessages([{ role: 'assistant', content: first_message }])
        } catch (err) {
          console.error('Session start failed:', err)
          setMessages([
            {
              role: 'assistant',
              content: 'Failed to start session — please try again.',
              isError: true,
            },
          ])
        } finally {
          setIsLoading(false)
        }
      }, 4000)
    },
    [userId, currentPersona]
  )

  // ── Step C: Send a chat message ────────────────────────────────────────────
  const sendMessage = useCallback(
    async (text) => {
      if (!text.trim() || isLoading || convState !== 'CHATTING') return
      if (!sessionId) return

      const userMsg = { role: 'user', content: text.trim() }
      setMessages((prev) => [...prev, userMsg])
      setInputMessage('')
      setIsLoading(true)

      try {
        const data = await chatAPI.sendMessage(currentPersona, sessionId, text.trim())

        const botMsg = {
          role: 'assistant',
          content: data.response,
          safety: data.safety,
        }
        setMessages((prev) => [...prev, botMsg])
        setMessageCount(data.message_count)

        if (data.session_complete) {
          setConvState('GUESS_PROMPT')
        }
      } catch (err) {
        console.error('sendMessage failed:', err)
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: 'Something went wrong — please try again.',
            isError: true,
          },
        ])
      } finally {
        setIsLoading(false)
      }
    },
    [isLoading, convState, sessionId, currentPersona]
  )

  // ── Step D → E: User submits guess → reveal ────────────────────────────────
  const submitGuess = useCallback(
    async (guess) => {
      if (!sessionId) return
      setIsLoading(true)
      try {
        const data = await sessionAPI.reveal(sessionId, guess)
        setRevealData({ ...data, userGuess: guess })
        setConvState('REVEAL')

        // Refresh stats
        const stats = await userAPI.getStats(userId)
        setUserStats(stats)
      } catch (err) {
        console.error('Reveal failed:', err)
      } finally {
        setIsLoading(false)
        setConvState('REVEAL')
      }
    },
    [sessionId, userId]
  )

  // ── Step F: Start over ─────────────────────────────────────────────────────
  const resetConversation = useCallback(() => {
    setMessages([])
    setSessionId(null)
    setMessageCount(0)
    setRevealData(null)
    setInputMessage('')
    setConvState('IDLE')
  }, [])

  // ── Module completed ───────────────────────────────────────────────────────
  const markModuleComplete = useCallback(async () => {
    try {
      await userAPI.markModuleComplete(userId)
      setModuleCompleted(true)
    } catch (err) {
      console.error('Module complete failed:', err)
    }
  }, [userId])

  const loadStats = useCallback(async () => {
    try {
      const stats = await userAPI.getStats(userId)
      setUserStats(stats)
    } catch (err) {
      console.error('Load stats failed:', err)
    }
  }, [userId])

  return {
    userId,
    currentPersona,
    convState,
    messages,
    sessionId,
    messageCount,
    isLoading,
    isBackendReady,
    inputMessage,
    setInputMessage,
    revealData,
    moduleCompleted,
    userStats,
    // actions
    startConversation,
    handlePersonaChange,
    answerAwareness,
    sendMessage,
    submitGuess,
    resetConversation,
    markModuleComplete,
    loadStats,
  }
}

export default useChat
