import React from 'react'

/**
 * Step D — shown after 30 messages. User guesses scam or legit.
 * onGuess("scam" | "legit")
 */
function GuessPrompt({ onGuess, isLoading }) {
  return (
    <div className="border-t border-purple-200/50 dark:border-purple-900/50 bg-purple-50 dark:bg-[#120b2e] px-6 py-6">
      <div className="flex flex-col items-center text-center gap-4">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <div>
          <p className="font-semibold text-purple-900 dark:text-white text-sm">
            Time's up! 30 messages exchanged.
          </p>
          <p className="text-purple-600 dark:text-purple-300 text-sm mt-1">
            Based on this conversation, was this a <strong>scam</strong> or a <strong>legitimate</strong> interaction?
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => onGuess('scam')}
            disabled={isLoading}
            className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <span>🚨</span> It's a Scam
          </button>
          <button
            onClick={() => onGuess('legit')}
            disabled={isLoading}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <span>✅</span> Legitimate
          </button>
        </div>

        {isLoading && (
          <p className="text-xs text-purple-400 dark:text-purple-500 animate-pulse">
            Analysing conversation...
          </p>
        )}
      </div>
    </div>
  )
}

export default GuessPrompt
