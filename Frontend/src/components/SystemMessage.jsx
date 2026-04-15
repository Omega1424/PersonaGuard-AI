import React from 'react'

/**
 * Centered, muted system message — used for awareness check header,
 * ground rules, and reveal headers. Not a chat bubble.
 */
function SystemMessage({ children, variant = 'default' }) {
  const variants = {
    default: 'bg-purple-100/60 dark:bg-purple-950/60 border-purple-300/40 dark:border-purple-800/40 text-purple-700 dark:text-purple-300',
    warning: 'bg-amber-100/60 dark:bg-amber-950/40 border-amber-300/40 dark:border-amber-700/40 text-amber-700 dark:text-amber-300',
    success: 'bg-emerald-100/60 dark:bg-emerald-950/40 border-emerald-300/40 dark:border-emerald-700/40 text-emerald-700 dark:text-emerald-300',
    danger: 'bg-red-100/60 dark:bg-red-950/40 border-red-300/40 dark:border-red-700/40 text-red-700 dark:text-red-300',
  }

  return (
    <div className="flex justify-center my-4 px-4">
      <div className={`border rounded-xl px-5 py-3 text-sm text-center max-w-lg leading-relaxed ${variants[variant]}`}>
        {children}
      </div>
    </div>
  )
}

export default SystemMessage
