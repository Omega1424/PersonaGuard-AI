import React from 'react'

/**
 * Step A — asks user if they've completed the awareness module.
 * onAnswer(true/false)
 */
function AwarenessCheck({ onAnswer, personaLabel }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6 py-8">
      {/* Icon */}
      <div className="w-16 h-16 bg-gradient-to-br from-purple-700 to-pink-600 rounded-2xl flex items-center justify-center mb-5 shadow-xl shadow-purple-900/40">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </div>

      <span className="px-3 py-1 bg-pink-200/50 dark:bg-pink-500/20 border border-pink-400/40 text-pink-600 dark:text-pink-300 text-xs font-semibold rounded-full mb-4 uppercase tracking-wide">
        {personaLabel}
      </span>

      <h2 className="text-xl font-semibold text-purple-900 dark:text-white mb-2">
        Before we begin
      </h2>
      <p className="text-purple-600 dark:text-purple-300 text-sm mb-8 max-w-sm leading-relaxed">
        Have you completed the <strong>Scam Recognition Awareness Module</strong>?
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => onAnswer(true)}
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-pink-400 transition-all duration-200 shadow-lg shadow-purple-900/40"
        >
          Yes, I have
        </button>
        <button
          onClick={() => onAnswer(false)}
          className="px-8 py-3 bg-purple-100 dark:bg-purple-950/60 border border-purple-300/50 dark:border-purple-700/50 text-purple-700 dark:text-purple-300 font-semibold rounded-xl hover:bg-purple-200/60 dark:hover:bg-purple-900/40 transition-all duration-200"
        >
          Not yet
        </button>
      </div>

      <p className="mt-6 text-xs text-purple-400/60 dark:text-purple-500/60 max-w-xs leading-relaxed">
        Your answer is recorded to measure how the module improves scam detection accuracy.
      </p>
    </div>
  )
}

export default AwarenessCheck
