import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import AppLayout from './AppLayout'
import AwarenessModule from './pages/AwarenessModule'
import StatsPage from './pages/StatsPage'
import useChat from './hooks/useChat'

function AppRoot() {
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
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AppRoot />
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
