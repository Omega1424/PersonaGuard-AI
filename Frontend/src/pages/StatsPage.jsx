import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

const PERSONA_LABELS = {
  ahbeng: { label: 'Ah Beng', icon: '💼' },
  xmm: { label: 'XMM', icon: '💔' },
  spf: { label: 'SPF Officer', icon: '👮' },
  singlish: { label: 'Phishing', icon: '🎣' },
}

function StatCard({ label, value, sub, color = 'purple' }) {
  const colors = {
    purple: 'bg-purple-100/60 dark:bg-purple-950/50 border-purple-200/50 dark:border-purple-800/40 text-purple-900 dark:text-white',
    pink: 'bg-pink-100/60 dark:bg-pink-950/50 border-pink-200/50 dark:border-pink-800/40 text-pink-900 dark:text-pink-100',
    emerald: 'bg-emerald-100/60 dark:bg-emerald-950/50 border-emerald-200/50 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-100',
    amber: 'bg-amber-100/60 dark:bg-amber-950/50 border-amber-200/50 dark:border-amber-800/40 text-amber-900 dark:text-amber-100',
  }
  return (
    <div className={`border rounded-2xl p-4 text-center ${colors[color]}`}>
      <p className="text-2xl font-bold">{value ?? '—'}</p>
      <p className="text-sm font-medium mt-0.5">{label}</p>
      {sub && <p className="text-xs opacity-60 mt-0.5">{sub}</p>}
    </div>
  )
}

function StatsPage({ userStats, loadStats }) {
  useEffect(() => {
    if (loadStats) loadStats()
  }, [loadStats])

  const stats = userStats

  return (
    <div className="min-h-screen bg-[#f8f5ff] dark:bg-[#0d0521]">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-100 via-purple-200 to-purple-300 dark:from-[#0d0521] dark:via-purple-900 dark:to-[#3b0764] px-6 py-4 border-b border-purple-300/50 dark:border-purple-800/50 flex items-center gap-4">
        <Link
          to="/"
          className="p-2 text-purple-500 dark:text-purple-400 hover:text-purple-900 dark:hover:text-white transition-colors rounded-lg hover:bg-purple-200/40 dark:hover:bg-purple-900/40"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-lg font-bold text-purple-900 dark:text-white">My Stats</h1>
          <p className="text-sm text-pink-600 dark:text-pink-300/90">Your scam detection performance</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {!stats || stats.total_completed === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-5xl mb-4">📊</span>
            <p className="font-semibold text-purple-900 dark:text-white text-lg">No simulations yet</p>
            <p className="text-purple-500 dark:text-purple-400 text-sm mt-1 mb-6">Complete at least one simulation to see your stats.</p>
            <Link
              to="/"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-pink-400 transition-all duration-200 shadow-lg"
            >
              Start a Simulation
            </Link>
          </div>
        ) : (
          <>
            {/* Top stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard label="Simulations" value={stats.total_completed} color="purple" />
              <StatCard label="Accuracy" value={stats.accuracy != null ? `${stats.accuracy}%` : '—'} color="pink" />
              <StatCard label="Current Streak" value={`🔥 ${stats.current_streak}`} sub={`Best: ${stats.best_streak}`} color="amber" />
              <StatCard label="Scam Detect Rate" value={stats.scam_detection_rate != null ? `${stats.scam_detection_rate}%` : '—'} color="emerald" />
            </div>

            {/* Module impact */}
            {(stats.pre_module_accuracy != null || stats.post_module_accuracy != null) && (
              <div className="bg-white dark:bg-purple-950/30 border border-purple-200/50 dark:border-purple-800/40 rounded-2xl p-5">
                <h3 className="font-semibold text-purple-900 dark:text-white mb-4">📚 Awareness Module Impact</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-900 dark:text-white">
                      {stats.pre_module_accuracy != null ? `${stats.pre_module_accuracy}%` : '—'}
                    </p>
                    <p className="text-sm text-purple-500 dark:text-purple-400">Before module</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                      {stats.post_module_accuracy != null ? `${stats.post_module_accuracy}%` : '—'}
                    </p>
                    <p className="text-sm text-purple-500 dark:text-purple-400">After module</p>
                  </div>
                </div>
                {stats.pre_module_accuracy != null && stats.post_module_accuracy != null && (
                  <p className="text-xs text-center text-purple-400 dark:text-purple-500 mt-3">
                    {stats.post_module_accuracy > stats.pre_module_accuracy
                      ? `📈 +${(stats.post_module_accuracy - stats.pre_module_accuracy).toFixed(1)}% improvement after completing the module`
                      : 'Keep practising — the module helps over time!'}
                  </p>
                )}
              </div>
            )}

            {/* Per-persona breakdown */}
            <div className="bg-white dark:bg-purple-950/30 border border-purple-200/50 dark:border-purple-800/40 rounded-2xl p-5">
              <h3 className="font-semibold text-purple-900 dark:text-white mb-4">🎭 Accuracy by Persona</h3>
              <div className="space-y-3">
                {Object.entries(PERSONA_LABELS).map(([id, { label, icon }]) => {
                  const acc = stats.accuracy_by_persona?.[id]
                  return (
                    <div key={id} className="flex items-center gap-3">
                      <span className="text-xl">{icon}</span>
                      <span className="text-sm text-purple-700 dark:text-purple-300 w-32">{label}</span>
                      <div className="flex-1 h-2 bg-purple-100 dark:bg-purple-900/50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-400 rounded-full transition-all duration-700"
                          style={{ width: acc != null ? `${acc}%` : '0%' }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-purple-900 dark:text-white w-12 text-right">
                        {acc != null ? `${acc}%` : '—'}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Additional stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white dark:bg-purple-950/30 border border-purple-200/50 dark:border-purple-800/40 rounded-2xl p-4 text-center">
                <p className="text-2xl font-bold text-purple-900 dark:text-white">
                  {stats.false_positive_rate != null ? `${stats.false_positive_rate}%` : '—'}
                </p>
                <p className="text-sm text-purple-500 dark:text-purple-400">False positive rate</p>
                <p className="text-xs text-purple-400/70 dark:text-purple-600/70 mt-1">Called legit a scam</p>
              </div>
              <div className="bg-white dark:bg-purple-950/30 border border-purple-200/50 dark:border-purple-800/40 rounded-2xl p-4 text-center">
                <p className="text-2xl font-bold text-purple-900 dark:text-white">
                  {stats.best_streak}
                </p>
                <p className="text-sm text-purple-500 dark:text-purple-400">Best streak</p>
                <p className="text-xs text-purple-400/70 dark:text-purple-600/70 mt-1">Consecutive correct guesses</p>
              </div>
            </div>

            {/* Recent sessions */}
            {stats.sessions && stats.sessions.length > 0 && (
              <div className="bg-white dark:bg-purple-950/30 border border-purple-200/50 dark:border-purple-800/40 rounded-2xl p-5">
                <h3 className="font-semibold text-purple-900 dark:text-white mb-4">🕒 Recent Sessions</h3>
                <div className="space-y-2">
                  {stats.sessions.slice(0, 10).map((s, i) => {
                    const persona = PERSONA_LABELS[s.persona] || { label: s.persona, icon: '❓' }
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-3 py-2 border-b border-purple-100/50 dark:border-purple-800/30 last:border-0"
                      >
                        <span className="text-lg">{persona.icon}</span>
                        <div className="flex-1">
                          <p className="text-sm text-purple-800 dark:text-purple-200 font-medium">{persona.label}</p>
                          <p className="text-xs text-purple-400 dark:text-purple-500">
                            {s.completed_at ? new Date(s.completed_at).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' }) : 'In progress'}
                          </p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          s.mode === 'scam'
                            ? 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400'
                            : 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400'
                        }`}>
                          {s.mode === 'scam' ? '🚨 Scam' : '✅ Legit'}
                        </span>
                        <span className={`text-lg ${s.guess_correct ? 'text-emerald-500' : 'text-red-400'}`}>
                          {s.guess_correct ? '✓' : '✗'}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default StatsPage
