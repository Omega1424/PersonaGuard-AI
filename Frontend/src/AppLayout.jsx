import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from './components/Header'
import LeftSidebar from './components/LeftSidebar'
import ChatWindow from './components/ChatWindow'
import MessageCounter from './components/MessageCounter'

const PERSONA_LABELS = {
  ahbeng: 'Job Scam',
  xmm: 'Love Scam',
  spf: 'Police Impersonation',
}

function AppLayout({
  // from useChat
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
  moduleCompleted,
  // actions
  startConversation,
  handlePersonaChange,
  answerAwareness,
  submitGuess,
  resetConversation,
  // auth
  username,
  onLogout,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const navigate = useNavigate()

  const handleNewChat = () => {
    resetConversation()
    navigate('/')
  }

  const handlePersonaSelect = (personaId) => {
    handlePersonaChange(personaId)
    navigate('/')
  }

  const isChatting = convState === 'CHATTING'

  return (
    <div className="h-screen bg-[#f8f5ff] dark:bg-[#0d0521] flex flex-col overflow-hidden">
      <Header
        title="PersonaGuard AI"
        subtitle={`${PERSONA_LABELS[currentPersona] || 'Scam'} Simulator`}
      />

      <div className="flex-1 flex overflow-hidden h-full relative">
        {/* Sidebar */}
        <div className={`
          fixed lg:relative inset-y-0 left-0 z-30
          transition-all duration-300 flex-shrink-0 overflow-hidden h-full
          ${sidebarOpen ? 'w-80 translate-x-0' : 'w-0 -translate-x-full lg:translate-x-0'}
        `}>
          <LeftSidebar
            onNewChat={handleNewChat}
            onPersonaChange={handlePersonaSelect}
            currentPersona={currentPersona}
            moduleCompleted={moduleCompleted}
            username={username}
            onLogout={onLogout}
          />
        </div>

        {/* Main chat area */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          {/* Sub-bar */}
          <div className="flex items-center justify-between px-4 py-2 bg-purple-100 dark:bg-[#120b2e] border-b border-purple-200/50 dark:border-purple-900/50">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-purple-500 dark:text-purple-400 hover:text-purple-900 dark:hover:text-white transition-colors rounded-lg hover:bg-purple-200/40 dark:hover:bg-purple-900/40"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Message counter — shown only while chatting */}
            {isChatting && messageCount > 0 && (
              <MessageCounter count={messageCount} />
            )}

            {!isChatting && (
              <div className="flex items-center space-x-2 text-sm text-purple-400">
                <span>Messages:</span>
                <span className="px-2 py-0.5 bg-pink-200/50 dark:bg-pink-500/20 border border-pink-400/30 text-pink-600 dark:text-pink-300 rounded-full text-xs font-medium">
                  {messages.length}
                </span>
              </div>
            )}
          </div>

          <ChatWindow
            convState={convState}
            messages={messages}
            messageCount={messageCount}
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            sendMessage={sendMessage}
            isLoading={isLoading}
            isBackendReady={isBackendReady}
            currentPersona={currentPersona}
            revealData={revealData}
            answerAwareness={answerAwareness}
            submitGuess={submitGuess}
            resetConversation={resetConversation}
            startConversation={startConversation}
          />
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

export default AppLayout
