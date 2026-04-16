import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import AppLayout from './AppLayout'
import AwarenessModule from './pages/AwarenessModule'
import StatsPage from './pages/StatsPage'
import LoginPage from './pages/LoginPage'
import useChat from './hooks/useChat'

const STORAGE_USER_ID = 'personaguard_user_id'
const STORAGE_USERNAME = 'personaguard_username'

function AppRoot({ username, onLogout }) {
  const chat = useChat()

  return (
    <Routes>
      <Route
        path="/"
        element={
          <AppLayout
            convState={chat.convState}
            messages={chat.messages}
            messageCount={chat.messageCount}
            inputMessage={chat.inputMessage}
            setInputMessage={chat.setInputMessage}
            sendMessage={chat.sendMessage}
            isLoading={chat.isLoading}
            isBackendReady={chat.isBackendReady}
            currentPersona={chat.currentPersona}
            revealData={chat.revealData}
            moduleCompleted={chat.moduleCompleted}
            startConversation={chat.startConversation}
            handlePersonaChange={chat.handlePersonaChange}
            answerAwareness={chat.answerAwareness}
            submitGuess={chat.submitGuess}
            resetConversation={chat.resetConversation}
            username={username}
            onLogout={onLogout}
          />
        }
      />
      <Route
        path="/awareness"
        element={
          <AwarenessModule
            moduleCompleted={chat.moduleCompleted}
            onMarkComplete={chat.markModuleComplete}
          />
        }
      />
      <Route
        path="/stats"
        element={
          <StatsPage
            userStats={chat.userStats}
            loadStats={chat.loadStats}
          />
        }
      />
    </Routes>
  )
}

function App() {
  const [authState, setAuthState] = useState(() => {
    const userId = localStorage.getItem(STORAGE_USER_ID)
    const username = localStorage.getItem(STORAGE_USERNAME)
    return userId && username ? { userId, username } : null
  })

  const handleAuthSuccess = (userId, username) => {
    setAuthState({ userId, username })
  }

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_USER_ID)
    localStorage.removeItem(STORAGE_USERNAME)
    setAuthState(null)
  }

  return (
    <BrowserRouter>
      <ThemeProvider>
        {authState ? (
          <AppRoot
            username={authState.username}
            onLogout={handleLogout}
          />
        ) : (
          <LoginPage onSuccess={handleAuthSuccess} />
        )}
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
