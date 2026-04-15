import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const PERSONAS = [
  {
    id: 'ahbeng',
    name: 'Ah Beng',
    icon: '💼',
    scamType: 'Job Scam',
    description: 'Urgency + trust via familiar identity',
  },
  {
    id: 'xmm',
    name: 'XMM',
    icon: '💔',
    scamType: 'Love Scam',
    description: 'Emotional bond & isolation tactics',
  },
  {
    id: 'spf',
    name: 'SPF Officer',
    icon: '👮',
    scamType: 'Police Impersonation',
    description: 'Fear via perceived authority',
  },
  {
    id: 'singlish',
    name: 'Phishing',
    icon: '🎣',
    scamType: 'Phishing',
    description: 'Fake links & credential theft',
  },
]

function LeftSidebar({ onNewChat, onPersonaChange, currentPersona = 'ahbeng', moduleCompleted }) {
  const location = useLocation()
  const isOnChat = location.pathname === '/'

  return (
    <div className="w-80 bg-white dark:bg-[#0d0521] border-r border-purple-200/50 dark:border-purple-900/50 flex flex-col h-full">

      {/* Brand tag */}
      <div className="px-4 pt-4 pb-2">
        <p className="text-xs font-semibold text-purple-500/70 dark:text-purple-400/70 uppercase tracking-widest">
          Scam Simulator
        </p>
      </div>

      {/* New Simulation button */}
      <div className="px-4 pb-3 border-b border-purple-200/50 dark:border-purple-900/50">
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

      {/* Persona list */}
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="text-xs font-semibold text-purple-500/70 dark:text-purple-400/70 uppercase tracking-widest mb-3">
          Scam Scenarios
        </h3>
        <div className="space-y-2">
          {PERSONAS.map((persona) => (
            <button
              key={persona.id}
              onClick={() => onPersonaChange && onPersonaChange(persona.id)}
              className={`w-full px-3 py-3 rounded-xl flex items-start space-x-3 transition-all duration-200 text-left ${
                isOnChat && currentPersona === persona.id
                  ? 'bg-pink-100/60 dark:bg-pink-500/15 border border-pink-400/50 text-purple-900 dark:text-white'
                  : 'bg-purple-50 dark:bg-purple-950/40 border border-purple-200/50 dark:border-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:border-purple-400/50 dark:hover:border-purple-700/50 hover:text-purple-900 dark:hover:text-white'
              }`}
            >
              <span className="text-xl mt-0.5 flex-shrink-0">{persona.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm">{persona.name}</p>
                  {isOnChat && currentPersona === persona.id && (
                    <div className="w-2 h-2 bg-pink-400 rounded-full flex-shrink-0" />
                  )}
                </div>
                <p className={`text-xs font-medium mb-0.5 ${
                  isOnChat && currentPersona === persona.id
                    ? 'text-pink-600 dark:text-pink-300'
                    : 'text-purple-500 dark:text-purple-400'
                }`}>
                  {persona.scamType}
                </p>
                <p className="text-xs opacity-60 leading-tight">{persona.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Nav links */}
      <div className="border-t border-purple-200/50 dark:border-purple-900/50 p-4 space-y-1">
        <Link
          to="/awareness"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-900 dark:hover:text-white transition-colors duration-200"
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span>Awareness Module</span>
          {moduleCompleted && (
            <span className="ml-auto text-xs bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded-full">
              ✓
            </span>
          )}
        </Link>

        <Link
          to="/stats"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-900 dark:hover:text-white transition-colors duration-200"
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span>My Stats</span>
        </Link>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-purple-200/50 dark:border-purple-900/50">
        <p className="text-xs text-purple-400/60 dark:text-purple-500/60 leading-relaxed">
          Simulations are for educational purposes. Learn to spot red flags before real scammers do.
        </p>
      </div>
    </div>
  )
}

export default LeftSidebar
