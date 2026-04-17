import React from 'react'

/**
 * Step E — reveal card shown after user submits their guess.
 * revealData: { actual_mode, guess_correct, red_flags, userGuess, score_update, judge }
 */

const FLAG_TYPE_LABELS = {
  urgency: '⏰ Urgency',
  impersonation: '🎭 Impersonation',
  money_request: '💸 Money Request',
  emotional_manipulation: '💔 Emotional Manipulation',
  secrecy: '🤫 Secrecy',
  unrealistic_offer: '🎁 Unrealistic Offer',
  information_harvesting: '🕵️ Info Harvesting',
}

const QUALITY_CONFIG = {
  strong:    { label: 'Strong reasoning',   color: 'emerald', icon: '💡' },
  weak:      { label: 'Weak reasoning',     color: 'yellow',  icon: '🤔' },
  lucky:     { label: 'Lucky guess',        color: 'orange',  icon: '🍀' },
  incorrect: { label: 'Incorrect guess',    color: 'red',     icon: '❌' },
}

function DifficultyBar({ score }) {
  const pct = Math.round((score / 10) * 100)
  const color = score <= 3 ? 'bg-emerald-500' : score <= 6 ? 'bg-yellow-500' : 'bg-red-500'
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-purple-200 dark:bg-purple-900 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-sm font-bold text-purple-900 dark:text-white w-8 text-right">{score}/10</span>
    </div>
  )
}

function JudgePanel({ judge }) {
  if (!judge) return null

  const quality = QUALITY_CONFIG[judge.reasoning_quality] || QUALITY_CONFIG.incorrect

  return (
    <div className="space-y-4 border border-purple-300/50 dark:border-purple-700/50 rounded-2xl p-4 bg-white/40 dark:bg-purple-950/30">
      <p className="text-sm font-bold text-purple-800 dark:text-purple-200 flex items-center gap-2">
        <span>🤖</span> AI Judge Analysis
      </p>

      {/* Judgment reasoning */}
      <div className="rounded-xl p-3 bg-purple-50 dark:bg-purple-950/50 border border-purple-200/40 dark:border-purple-800/40">
        <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1 uppercase tracking-wide">
          Why this was {judge.ground_truth_judgment}
        </p>
        <p className="text-xs text-purple-800 dark:text-purple-200">{judge.judgment_reasoning}</p>
      </div>

      {/* Reasoning quality */}
      <div className={`rounded-xl p-3 bg-${quality.color}-50 dark:bg-${quality.color}-950/40 border border-${quality.color}-200/50 dark:border-${quality.color}-800/40`}>
        <p className={`text-xs font-semibold text-${quality.color}-700 dark:text-${quality.color}-300 mb-1 flex items-center gap-1`}>
          <span>{quality.icon}</span> {quality.label}
        </p>
        <p className={`text-xs text-${quality.color}-700 dark:text-${quality.color}-300`}>
          {judge.reasoning_explanation}
        </p>
      </div>

      {/* Red flags from judge (scam only) */}
      {judge.red_flags && judge.red_flags.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide flex items-center gap-1">
            <span>🚩</span> Manipulation Tactics Detected
          </p>
          <div className="space-y-2">
            {judge.red_flags.map((flag, i) => (
              <div
                key={i}
                className="bg-red-50 dark:bg-red-950/30 border border-red-200/40 dark:border-red-800/30 rounded-xl p-3"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold bg-red-200 dark:bg-red-900/60 text-red-700 dark:text-red-300 px-2 py-0.5 rounded-full">
                    {FLAG_TYPE_LABELS[flag.type] || flag.type}
                  </span>
                </div>
                <p className="text-xs font-mono text-red-700 dark:text-red-300 italic mb-1">"{flag.phrase}"</p>
                <p className="text-xs text-red-600 dark:text-red-400">{flag.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pedagogical feedback */}
      <div className="rounded-xl p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200/40 dark:border-blue-800/40">
        <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1 uppercase tracking-wide">
          📚 What to remember
        </p>
        <p className="text-xs text-blue-700 dark:text-blue-300">{judge.pedagogical_feedback}</p>
      </div>

      {/* Difficulty */}
      <div>
        <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2 uppercase tracking-wide">
          🎯 Deception Difficulty
        </p>
        <DifficultyBar score={judge.difficulty_score} />
        <p className="text-xs text-purple-500 dark:text-purple-400 mt-1">{judge.difficulty_explanation}</p>
      </div>
    </div>
  )
}

function RevealCard({ revealData, onNewConversation }) {
  if (!revealData) return null

  const { actual_mode, guess_correct, red_flags, userGuess, score_update, judge } = revealData
  const isScam = actual_mode === 'scam'

  return (
    <div className="border-t border-purple-200/50 dark:border-purple-900/50 bg-purple-50 dark:bg-[#120b2e] px-6 py-6 space-y-5">

      {/* Ground truth banner */}
      <div className={`rounded-2xl p-5 text-center border ${
        isScam
          ? 'bg-red-100/70 dark:bg-red-950/50 border-red-300/50 dark:border-red-700/50'
          : 'bg-emerald-100/70 dark:bg-emerald-950/50 border-emerald-300/50 dark:border-emerald-700/50'
      }`}>
        <p className={`text-2xl font-bold mb-1 ${isScam ? 'text-red-700 dark:text-red-300' : 'text-emerald-700 dark:text-emerald-300'}`}>
          {isScam ? '🚨 This was a SCAM' : '✅ This was LEGITIMATE'}
        </p>
        <p className={`text-sm ${isScam ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
          {isScam
            ? 'The AI was playing a scammer — here\'s how it tried to manipulate you.'
            : 'This was a genuine interaction — no manipulation tactics were used.'}
        </p>
      </div>

      {/* User result */}
      <div className={`rounded-xl p-4 flex items-center gap-3 border ${
        guess_correct
          ? 'bg-emerald-100/60 dark:bg-emerald-950/40 border-emerald-300/40 dark:border-emerald-700/40'
          : 'bg-red-100/60 dark:bg-red-950/40 border-red-300/40 dark:border-red-700/40'
      }`}>
        <span className="text-2xl">{guess_correct ? '🎉' : '😬'}</span>
        <div>
          <p className={`font-semibold text-sm ${guess_correct ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'}`}>
            {guess_correct ? 'You guessed correctly!' : 'You guessed incorrectly.'}
          </p>
          <p className="text-xs text-purple-500 dark:text-purple-400 mt-0.5">
            You said: <strong>{userGuess === 'scam' ? '🚨 Scam' : '✅ Legitimate'}</strong>
            {' · '}
            Reality: <strong>{isScam ? '🚨 Scam' : '✅ Legitimate'}</strong>
          </p>
        </div>
      </div>

      {/* Score update */}
      {score_update && (
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Simulations', value: score_update.total_completed },
            { label: 'Accuracy', value: score_update.accuracy != null ? `${score_update.accuracy}%` : '—' },
            { label: 'Streak', value: `🔥 ${score_update.current_streak}` },
            { label: 'Scam detect', value: score_update.scam_detection_rate != null ? `${score_update.scam_detection_rate}%` : '—' },
          ].map(({ label, value }) => (
            <div key={label} className="bg-purple-100/50 dark:bg-purple-950/50 border border-purple-200/40 dark:border-purple-800/40 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-purple-900 dark:text-white">{value}</p>
              <p className="text-xs text-purple-500 dark:text-purple-400">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* HF classifier red flags (scam only) */}
      {isScam && red_flags && red_flags.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
            <span>🚩</span> Red flags used in this conversation
          </p>
          <div className="space-y-2">
            {red_flags.map((flag, i) => (
              <div
                key={i}
                className="bg-red-50 dark:bg-red-950/40 border border-red-200/50 dark:border-red-800/40 rounded-xl p-3"
              >
                <p className="text-xs font-mono text-red-700 dark:text-red-300 italic mb-1">
                  "{flag.phrase}"
                </p>
                <p className="text-xs text-red-600 dark:text-red-400">
                  {flag.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legit — no red flags note */}
      {!isScam && !judge && (
        <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-800/40 rounded-xl p-4">
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-2">
            ✅ What made this legitimate
          </p>
          <ul className="text-xs text-emerald-600 dark:text-emerald-400 space-y-1 list-disc list-inside">
            <li>No requests for money, OTP, or personal financial info</li>
            <li>No artificial urgency or pressure tactics</li>
            <li>No isolation from family or friends</li>
            <li>Encouraged independent verification</li>
          </ul>
        </div>
      )}

      {/* Gemini LLM Judge */}
      <JudgePanel judge={judge} />

      {/* New simulation button */}
      <button
        onClick={onNewConversation}
        className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-pink-400 transition-all duration-200 shadow-lg shadow-purple-900/40"
      >
        Start New Simulation
      </button>
    </div>
  )
}

export default RevealCard
