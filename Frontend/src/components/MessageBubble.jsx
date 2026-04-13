import React, { useState } from 'react'

function MessageBubble({ message, isUser, safety }) {
  const [isRevealed, setIsRevealed] = useState(false)

  const censorText = (text) => {
    return '[Content Hidden — Click to Reveal]'
  }

  const shouldCensor = !isUser && safety === 'Unsafe' && !isRevealed

  return (
    <div
      className={`flex mb-4 ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
    >
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl ${
          isUser
            ? 'bg-gradient-to-br from-purple-600 to-pink-500 text-white rounded-br-sm shadow-lg shadow-purple-900/40'
            : shouldCensor
            ? 'bg-red-950/60 border border-red-500/40 text-red-200 rounded-bl-sm'
            : 'bg-purple-100 dark:bg-[#1e0a4c] border border-purple-300/40 dark:border-purple-800/40 text-purple-900 dark:text-purple-100 rounded-bl-sm'
        }`}
      >
        {/* Safety warning for unsafe content */}
        {shouldCensor && (
          <div className="mb-2 text-red-400 text-xs font-medium">
            ⚠️ This content has been flagged as potentially inappropriate
          </div>
        )}

        <p
          className={`text-sm leading-relaxed whitespace-pre-wrap ${
            shouldCensor ? 'cursor-pointer hover:text-red-300' : ''
          }`}
          onClick={() => {
            if (shouldCensor) {
              setIsRevealed(true)
            }
          }}
        >
          {shouldCensor ? censorText(message) : message}
        </p>

        <p
          className={`text-xs mt-1 ${
            isUser ? 'text-pink-200/70' : 'text-purple-500/60 dark:text-purple-400/60'
          }`}
        >
          {new Date().toLocaleTimeString('en-SG', {
            hour: '2-digit',
            minute: '2-digit'
          })}
          {!isUser && safety === 'Unsafe' && ' • ⚠️ Flagged'}
        </p>
      </div>
    </div>
  )
}

export default MessageBubble
