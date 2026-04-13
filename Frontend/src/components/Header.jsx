import React from 'react'
import { useTheme } from '../contexts/ThemeContext'

function Header({ title = "PersonaGuard AI", subtitle = "Scam or Not?" }) {
  const { toggleTheme, isDark } = useTheme()

  return (
    <div className="bg-gradient-to-r from-purple-100 via-purple-200 to-purple-300 dark:from-[#0d0521] dark:via-purple-900 dark:to-[#3b0764] px-6 py-4 flex items-center justify-between shadow-lg border-b border-purple-300/50 dark:border-purple-800/50">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-pink-500/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-pink-400/30">
          <svg className="w-5 h-5 text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div>
          <h1 className="text-lg font-bold text-purple-900 dark:text-white leading-tight">{title}</h1>
          <p className="text-sm text-pink-600 dark:text-pink-300/90 font-medium">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="text-purple-500/80 dark:text-purple-300/80 hover:text-purple-900 dark:hover:text-white transition-colors duration-200 p-2 hover:bg-purple-300/30 dark:hover:bg-white/10 rounded-lg"
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}

export default Header
