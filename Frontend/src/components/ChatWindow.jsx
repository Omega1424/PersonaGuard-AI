import React, { useEffect, useRef } from 'react'
import HighlightedMessage from './HighlightedMessage'
import AwarenessCheck from './AwarenessCheck'
import MessageCounter from './MessageCounter'
import GuessPrompt from './GuessPrompt'
import RevealCard from './RevealCard'
import SystemMessage from './SystemMessage'

const PERSONA_META = {
  ahbeng: {
    label: 'Job Scam',
    title: 'Ah Beng — Job Scam Simulator',
    description: "The AI will play a Singlish-speaking character. It may be a genuine friend with a job tip — or a scammer. Chat naturally and try to figure it out.",
    prompts: [
      "Tell me more about this job offer",
      "How much can I earn per day?",
      "What tasks do I need to do?",
      "Is this a registered company?",
      "Why contact me on WhatsApp?",
      "I'm not sure, can I verify first?",
    ],
  },
  xmm: {
    label: 'Love Scam',
    title: 'XMM — Love Scam Simulator',
    description: "The AI will play a young Singaporean woman on a social app. She may be genuine — or she may be setting you up. Chat naturally and watch for red flags.",
    prompts: [
      "How did you find my number?",
      "Tell me more about yourself",
      "Are you who you say you are?",
      "Why are you messaging me?",
      "I feel like we have a connection",
      "Can we video call sometime?",
    ],
  },
  spf: {
    label: 'Police Impersonation',
    title: 'SPF Officer — Police Impersonation Simulator',
    description: "The AI will play an SPF officer. They may be a real officer with a community advisory — or a scammer impersonating one. Stay alert.",
    prompts: [
      "What crime am I involved in?",
      "Can I call SPF to verify this?",
      "Why can't I tell my family?",
      "I've done nothing wrong",
      "Why do I need to transfer money?",
      "Let me speak to your superior",
    ],
  },
  singlish: {
    label: 'Phishing',
    title: 'Phishing Simulator',
    description: "The AI will play a customer service agent from a bank or SingPass. They may be legitimate — or they may be phishing for your credentials.",
    prompts: [
      "I got a message saying my account is suspended",
      "This says I have a parcel to collect",
      "It says I need to verify my Singpass",
      "Should I click this link?",
      "Why is it asking for my OTP?",
      "This looks like it's from my bank",
    ],
  },
}

function ChatWindow({
  convState,
  messages,
  messageCount,
  inputMessage,
  setInputMessage,
  sendMessage,
  isLoading,
  isBackendReady,
  currentPersona,
  revealData,
  answerAwareness,
  submitGuess,
  resetConversation,
  startConversation,
}) {
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading, convState])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [inputMessage])

  const meta = PERSONA_META[currentPersona] || PERSONA_META.ahbeng

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

  // ── Which red flags apply to each message (by message_index from reveal) ───
  const getFlagsForMessageIndex = (msgIndex) => {
    if (!revealData?.red_flags) return []
    return revealData.red_flags.filter((f) => f.message_index === msgIndex)
  }

  // assistant messages start at index 1, interleaved after that
  // We'll map by position: index 0 in messages array = message_index 1 (assistant opener)
  // then user at index 1 = DB index 2, assistant at index 2 = DB index 3, etc.
  const getDbIndex = (arrayIndex) => arrayIndex + 1

  // ── Backend loading ────────────────────────────────────────────────────────
  if (!isBackendReady) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full bg-[#f8f5ff] dark:bg-[#0d0521] text-center px-6">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-700 to-pink-600 rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-purple-900/50 animate-pulse">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-purple-900 dark:text-white mb-2">Initialising PersonaGuard AI...</h2>
        <p className="text-purple-500/70 dark:text-purple-300/70 mb-6 max-w-md text-sm">
          The backend server is starting up. This may take a moment.
        </p>
        <div className="flex items-center space-x-2 text-sm text-purple-500/60 dark:text-purple-400/60">
          <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          <span className="ml-2">Connecting to backend...</span>
        </div>
      </div>
    )
  }

  // ── IDLE — persona selection landing ──────────────────────────────────────
  if (convState === 'IDLE') {
    return (
      <div className="flex-1 flex flex-col h-full bg-[#f8f5ff] dark:bg-[#0d0521]">
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-700 to-pink-600 rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-purple-900/50">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>

          <span className="px-3 py-1 bg-pink-200/50 dark:bg-pink-500/20 border border-pink-400/40 text-pink-600 dark:text-pink-300 text-xs font-semibold rounded-full mb-3 uppercase tracking-wide">
            {meta.label}
          </span>

          <h2 className="text-xl font-semibold text-purple-900 dark:text-white mb-2">{meta.title}</h2>
          <p className="text-purple-500/70 dark:text-purple-300/70 mb-6 max-w-md text-sm leading-relaxed">
            {meta.description}
          </p>

          <button
            onClick={startConversation}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-pink-400 transition-all duration-200 shadow-lg shadow-purple-900/40 mb-8"
          >
            Start Simulation
          </button>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl">
            {meta.prompts.map((prompt, i) => (
              <div
                key={i}
                className="px-4 py-3 bg-purple-100/60 dark:bg-purple-950/60 border border-purple-300/50 dark:border-purple-800/50 text-purple-600 dark:text-purple-300 rounded-xl text-sm text-left opacity-60"
              >
                {prompt}
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-purple-400/50 dark:text-purple-600/50">
            Sample conversation starters — unlocked once simulation begins
          </p>
        </div>
      </div>
    )
  }

  // ── AWARENESS_CHECK ────────────────────────────────────────────────────────
  if (convState === 'AWARENESS_CHECK') {
    return (
      <div className="flex-1 h-full bg-[#f8f5ff] dark:bg-[#0d0521]">
        <AwarenessCheck onAnswer={answerAwareness} personaLabel={meta.label} />
      </div>
    )
  }

  // ── GROUND_RULES ──────────────────────────────────────────────────────────
  if (convState === 'GROUND_RULES') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full bg-[#f8f5ff] dark:bg-[#0d0521] text-center px-6">
        <div className="w-14 h-14 bg-gradient-to-br from-purple-700 to-pink-600 rounded-2xl flex items-center justify-center mb-5 shadow-xl shadow-purple-900/40 animate-pulse">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-purple-900 dark:text-white mb-3">Ground Rules</h2>
        <div className="bg-purple-100/60 dark:bg-purple-950/60 border border-purple-300/40 dark:border-purple-800/40 rounded-2xl px-6 py-5 max-w-md text-sm text-purple-700 dark:text-purple-300 leading-relaxed mb-4">
          This conversation <strong>may be a scam or may be completely legitimate.</strong>
          <br /><br />
          Chat naturally and try to figure it out. The truth will be revealed after <strong>30 messages</strong>.
        </div>
        <div className="flex items-center space-x-2 text-sm text-purple-500/60 dark:text-purple-400/60">
          <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          <span className="ml-2">Starting conversation...</span>
        </div>
      </div>
    )
  }

  // ── CHATTING / GUESS_PROMPT / REVEAL / COMPLETE ────────────────────────────
  const inputDisabled = convState !== 'CHATTING' || isLoading || !isBackendReady

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8f5ff] dark:bg-[#0d0521]">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-1">

        {convState === 'CHATTING' && messages.length === 0 && (
          <SystemMessage>Conversation starting…</SystemMessage>
        )}

        {messages.map((msg, i) => {
          const dbIdx = getDbIndex(i)
          const flags = (convState === 'REVEAL' || convState === 'COMPLETE')
            ? getFlagsForMessageIndex(dbIdx)
            : []

          return (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
              <HighlightedMessage
                message={msg.content}
                isUser={msg.role === 'user'}
                safety={msg.safety}
                redFlags={flags}
              />
            </div>
          )
        })}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-purple-100 dark:bg-[#1e0a4c] border border-purple-300/40 dark:border-purple-800/40 px-4 py-3 rounded-2xl rounded-bl-sm shadow-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom area — varies by state */}
      {convState === 'GUESS_PROMPT' && (
        <GuessPrompt onGuess={submitGuess} isLoading={isLoading} />
      )}

      {(convState === 'REVEAL' || convState === 'COMPLETE') && revealData && (
        <RevealCard revealData={revealData} onNewConversation={resetConversation} />
      )}

      {convState === 'CHATTING' && (
        <div className="border-t border-purple-200/50 dark:border-purple-900/50 bg-purple-50 dark:bg-[#120b2e] px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Reply to the ${meta.label} persona…`}
                disabled={inputDisabled}
                rows={1}
                className="w-full px-4 py-3 bg-white dark:bg-purple-950/60 border border-purple-300/40 dark:border-purple-800/40 text-purple-900 dark:text-white rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 placeholder-purple-400/60 dark:placeholder-purple-500/60 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!inputMessage.trim() || inputDisabled}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-2xl hover:from-purple-500 hover:to-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-purple-900/50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18-9-2 9z" />
              </svg>
            </button>
          </div>

          {messages.length === 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {meta.prompts.slice(0, 4).map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => setInputMessage(prompt)}
                  className="px-3 py-1.5 bg-purple-100/50 dark:bg-purple-950/50 border border-purple-300/40 dark:border-purple-800/40 text-purple-600 dark:text-purple-300 rounded-lg text-xs hover:bg-purple-200/40 dark:hover:bg-purple-900/40 hover:text-purple-900 dark:hover:text-white hover:border-purple-400/60 dark:hover:border-purple-700/60 transition-colors duration-200"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </div>
  )
}

export default ChatWindow
