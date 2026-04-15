import React from 'react'

/**
 * Like MessageBubble but can highlight flagged phrases in red after reveal.
 * redFlags: [{phrase, explanation}] — phrases to underline in the message text.
 */
function HighlightedMessage({ message, isUser, safety, redFlags = [] }) {
  const [tooltip, setTooltip] = React.useState(null)

  // Build highlighted content
  const renderContent = () => {
    if (!redFlags || redFlags.length === 0 || isUser) {
      return <span className="whitespace-pre-wrap">{message}</span>
    }

    // Sort flags by position in text (longest first to avoid partial overwrites)
    let parts = [{ text: message, flagged: false, explanation: null }]

    for (const flag of redFlags) {
      const phrase = flag.phrase
      if (!phrase) continue

      const newParts = []
      for (const part of parts) {
        if (part.flagged) {
          newParts.push(part)
          continue
        }
        const idx = part.text.toLowerCase().indexOf(phrase.toLowerCase())
        if (idx === -1) {
          newParts.push(part)
        } else {
          if (idx > 0) newParts.push({ text: part.text.slice(0, idx), flagged: false, explanation: null })
          newParts.push({
            text: part.text.slice(idx, idx + phrase.length),
            flagged: true,
            explanation: flag.explanation,
          })
          if (idx + phrase.length < part.text.length) {
            newParts.push({ text: part.text.slice(idx + phrase.length), flagged: false, explanation: null })
          }
        }
      }
      parts = newParts
    }

    return (
      <span className="whitespace-pre-wrap">
        {parts.map((p, i) =>
          p.flagged ? (
            <span
              key={i}
              className="bg-red-200/70 dark:bg-red-800/60 text-red-900 dark:text-red-200 underline decoration-red-500 cursor-help rounded px-0.5"
              title={p.explanation}
              onClick={() => setTooltip(tooltip === i ? null : i)}
            >
              {p.text}
              {tooltip === i && (
                <span className="block text-xs bg-red-700 text-white rounded px-2 py-1 mt-1 not-italic font-normal whitespace-normal cursor-default">
                  🚩 {p.explanation}
                </span>
              )}
            </span>
          ) : (
            <span key={i}>{p.text}</span>
          )
        )}
      </span>
    )
  }

  const [isRevealed, setIsRevealed] = React.useState(false)
  const shouldCensor = !isUser && safety === 'Unsafe' && !isRevealed

  return (
    <div className={`flex mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl ${
          isUser
            ? 'bg-gradient-to-br from-purple-600 to-pink-500 text-white rounded-br-sm shadow-lg shadow-purple-900/40'
            : shouldCensor
            ? 'bg-red-950/60 border border-red-500/40 text-red-200 rounded-bl-sm'
            : 'bg-purple-100 dark:bg-[#1e0a4c] border border-purple-300/40 dark:border-purple-800/40 text-purple-900 dark:text-purple-100 rounded-bl-sm'
        }`}
      >
        {shouldCensor && (
          <div className="mb-2 text-red-400 text-xs font-medium">
            ⚠️ Flagged as potentially inappropriate
          </div>
        )}

        <p
          className={`text-sm leading-relaxed ${shouldCensor ? 'cursor-pointer hover:text-red-300' : ''}`}
          onClick={() => shouldCensor && setIsRevealed(true)}
        >
          {shouldCensor ? '[Content Hidden — Click to Reveal]' : renderContent()}
        </p>

        <p className={`text-xs mt-1 ${isUser ? 'text-pink-200/70' : 'text-purple-500/60 dark:text-purple-400/60'}`}>
          {new Date().toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit' })}
          {!isUser && safety === 'Unsafe' && ' • ⚠️ Flagged'}
        </p>
      </div>
    </div>
  )
}

export default HighlightedMessage
