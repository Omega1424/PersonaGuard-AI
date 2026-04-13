import React from 'react'

function LeftSidebar({ onNewChat, onPersonaChange, currentPersona = "singlish" }) {
  const personas = [
    {
      id: "ahbeng",
      name: "Ah Beng",
      icon: "💼",
      scamType: "Job Scam",
      description: "Urgency + trust via familiar identity",
      endpoint: "/chat/ahbeng"
    },
    {
      id: "xmm",
      name: "XMM",
      icon: "💔",
      scamType: "Love Scam",
      description: "Emotional bond & isolation tactics",
      endpoint: "/chat/xmm"
    },
    {
      id: "nsf",
      name: "SPF Officer",
      icon: "👮",
      scamType: "Police Impersonation",
      description: "Fear via fake SPF identity",
      endpoint: "/chat/nsf"
    },
    {
      id: "singlish",
      name: "Phishing",
      icon: "🎣",
      scamType: "Phishing",
      description: "Fake links & credential theft",
      endpoint: "/chat/singlish"
    }
  ]

  return (
    <div className="w-80 bg-white dark:bg-[#0d0521] border-r border-purple-200/50 dark:border-purple-900/50 flex flex-col h-full">
      {/* Brand tag */}
      <div className="px-4 pt-4 pb-2">
        <p className="text-xs font-semibold text-purple-500/70 dark:text-purple-400/70 uppercase tracking-widest">Scam Simulator</p>
      </div>

      {/* New Chat Button */}
      <div className="px-4 pb-3 border-b border-purple-900/50">
        <button
          onClick={onNewChat}
          className="w-full px-4 py-3 bg-gradient-to-r from-purple-700 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-500 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-purple-900/40"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="font-medium">New Simulation</span>
        </button>
      </div>

      {/* Persona Selector */}
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="text-xs font-semibold text-purple-500/70 dark:text-purple-400/70 uppercase tracking-widest mb-3">Scam Scenarios</h3>
        <div className="space-y-2">
          {personas.map((persona) => (
            <button
              key={persona.id}
              onClick={() => onPersonaChange && onPersonaChange(persona.id)}
              className={`w-full px-3 py-3 rounded-xl flex items-start space-x-3 transition-all duration-200 text-left ${
                currentPersona === persona.id
                  ? 'bg-pink-100/60 dark:bg-pink-500/15 border border-pink-400/50 text-purple-900 dark:text-white'
                  : 'bg-purple-50 dark:bg-purple-950/40 border border-purple-200/50 dark:border-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:border-purple-400/50 dark:hover:border-purple-700/50 hover:text-purple-900 dark:hover:text-white'
              }`}
            >
              <span className="text-xl mt-0.5 flex-shrink-0">{persona.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm">{persona.name}</p>
                  {currentPersona === persona.id && (
                    <div className="w-2 h-2 bg-pink-400 rounded-full flex-shrink-0"></div>
                  )}
                </div>
                <p className={`text-xs font-medium mb-0.5 ${currentPersona === persona.id ? 'text-pink-600 dark:text-pink-300' : 'text-purple-500 dark:text-purple-400'}`}>
                  {persona.scamType}
                </p>
                <p className="text-xs opacity-60 leading-tight">{persona.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer info */}
      <div className="px-4 py-3 border-t border-purple-200/50 dark:border-purple-900/50">
        <p className="text-xs text-purple-400/60 dark:text-purple-500/60 leading-relaxed">
          Simulations are for educational purposes. Learn to spot red flags before real scammers do.
        </p>
      </div>
    </div>
  )
}

export default LeftSidebar
