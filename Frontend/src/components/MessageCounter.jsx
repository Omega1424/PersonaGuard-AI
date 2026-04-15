import React from 'react'

const MAX = 30

function MessageCounter({ count }) {
  const pct = Math.min((count / MAX) * 100, 100)
  const remaining = MAX - count
  const isNearEnd = remaining <= 5

  return (
    <div className="flex items-center gap-3 text-xs">
      {/* Label */}
      <span className={`font-medium ${isNearEnd ? 'text-pink-500 dark:text-pink-400' : 'text-purple-500 dark:text-purple-400'}`}>
        Message {count} / {MAX}
      </span>

      {/* Progress bar */}
      <div className="w-24 h-1.5 bg-purple-200/50 dark:bg-purple-900/50 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isNearEnd
              ? 'bg-gradient-to-r from-pink-500 to-red-400'
              : 'bg-gradient-to-r from-purple-500 to-pink-400'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {isNearEnd && remaining > 0 && (
        <span className="text-pink-500 dark:text-pink-400 font-semibold animate-pulse">
          {remaining} left!
        </span>
      )}
    </div>
  )
}

export default MessageCounter
