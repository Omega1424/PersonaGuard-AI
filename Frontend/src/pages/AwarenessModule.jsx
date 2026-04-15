import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const SECTIONS = [
  {
    id: 'types',
    title: 'Common Scam Types in Singapore',
    icon: '🎭',
    items: [
      {
        label: 'Job Scams',
        detail: 'Fake job offers requiring upfront payment or personal info. Often promise unusually high pay for simple tasks like clicking reviews or liking posts.',
        color: 'amber',
      },
      {
        label: 'Love Scams',
        detail: 'Scammers build emotional bonds through dating apps or social media before requesting money, investments, or gifts.',
        color: 'pink',
      },
      {
        label: 'Government Impersonation',
        detail: 'Fake SPF, MAS, or IRAS officers threaten arrest or legal action unless you transfer money or share personal details.',
        color: 'blue',
      },
      {
        label: 'Phishing',
        detail: 'Fake messages from banks, SingPass, or delivery services trick you into clicking links and entering credentials.',
        color: 'red',
      },
    ],
  },
  {
    id: 'redflags',
    title: 'Red Flags to Watch For',
    icon: '🚩',
    items: [
      { label: 'Unsolicited contact', detail: 'Random messages via WhatsApp or Telegram about jobs, love, or prizes you didn\'t apply for.' },
      { label: 'Urgency and pressure', detail: '"Must do today", "limited time only", "act now" — scammers rush you before you can think.' },
      { label: 'Requests for money or OTP', detail: 'Legitimate services never ask for OTP, NRIC, bank account numbers, or upfront payments over chat.' },
      { label: 'Too-good-to-be-true offers', detail: '$300/day for clicking reviews? A stranger falling in love in 3 days? Be sceptical.' },
      { label: 'Isolation tactics', detail: '"Don\'t tell your family" or "keep this secret" — scammers isolate victims from people who might warn them.' },
      { label: 'Emotional manipulation', detail: 'Love bombing, fear of arrest, guilt-tripping — all used to bypass your critical thinking.' },
    ],
  },
  {
    id: 'action',
    title: 'What To Do',
    icon: '✅',
    items: [
      { label: 'Stop and think', detail: 'Scammers rely on urgency. Pause, breathe, and consider: would a legitimate entity really ask for this?' },
      { label: 'Do not send money or personal info', detail: 'Once money is sent or OTP is shared, recovery is nearly impossible.' },
      { label: 'Verify independently', detail: 'Call the official hotline (not the number they gave you). Check police.gov.sg or the official app.' },
      { label: 'Report to ScamShield', detail: 'Download the ScamShield app or call 1800-722-6688 to report scam messages and block known scammers.' },
      { label: 'Tell someone you trust', detail: 'Scammers tell you to keep things secret. Talk to family or friends — they might spot what you missed.' },
    ],
  },
  {
    id: 'examples',
    title: 'Real Scam Examples',
    icon: '💬',
    isPlaceholder: true,
    placeholder: 'Annotated example conversations will be added here. Each will show a realistic scam exchange with red flags highlighted inline.',
  },
]

const COLOR_MAP = {
  amber: 'bg-amber-100/60 dark:bg-amber-950/40 border-amber-300/40 dark:border-amber-700/40 text-amber-700 dark:text-amber-300',
  pink: 'bg-pink-100/60 dark:bg-pink-950/40 border-pink-300/40 dark:border-pink-700/40 text-pink-700 dark:text-pink-300',
  blue: 'bg-blue-100/60 dark:bg-blue-950/40 border-blue-300/40 dark:border-blue-700/40 text-blue-700 dark:text-blue-300',
  red: 'bg-red-100/60 dark:bg-red-950/40 border-red-300/40 dark:border-red-700/40 text-red-700 dark:text-red-300',
  default: 'bg-purple-100/60 dark:bg-purple-950/40 border-purple-300/40 dark:border-purple-800/40 text-purple-700 dark:text-purple-300',
}

function AwarenessModule({ moduleCompleted, onMarkComplete }) {
  const [openSection, setOpenSection] = useState('types')

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
          <h1 className="text-lg font-bold text-purple-900 dark:text-white">Scam Recognition Awareness Module</h1>
          <p className="text-sm text-pink-600 dark:text-pink-300/90">Learn to spot common scam tactics used in Singapore</p>
        </div>
        {moduleCompleted && (
          <span className="ml-auto px-3 py-1 bg-emerald-100 dark:bg-emerald-900/40 border border-emerald-300/50 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-300 text-xs font-semibold rounded-full">
            ✓ Completed
          </span>
        )}
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-4">
        {SECTIONS.map((section) => (
          <div
            key={section.id}
            className="bg-white dark:bg-purple-950/30 border border-purple-200/50 dark:border-purple-800/40 rounded-2xl overflow-hidden"
          >
            {/* Section header */}
            <button
              className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
              onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
            >
              <span className="text-2xl">{section.icon}</span>
              <span className="flex-1 font-semibold text-purple-900 dark:text-white">{section.title}</span>
              <svg
                className={`w-5 h-5 text-purple-400 transition-transform duration-200 ${openSection === section.id ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Section body */}
            {openSection === section.id && (
              <div className="px-5 pb-5 border-t border-purple-100/50 dark:border-purple-800/30">
                {section.isPlaceholder ? (
                  <div className="mt-4 bg-purple-50 dark:bg-purple-950/40 border border-dashed border-purple-300/50 dark:border-purple-700/50 rounded-xl p-6 text-center">
                    <p className="text-sm text-purple-500 dark:text-purple-400 italic">{section.placeholder}</p>
                    <span className="mt-2 inline-block text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full">Coming soon</span>
                  </div>
                ) : (
                  <div className="mt-4 space-y-3">
                    {section.items.map((item, i) => (
                      <div
                        key={i}
                        className={`border rounded-xl p-4 ${COLOR_MAP[item.color] || COLOR_MAP.default}`}
                      >
                        <p className="font-semibold text-sm mb-1">{item.label}</p>
                        <p className="text-xs leading-relaxed opacity-90">{item.detail}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Mark as completed */}
        <div className="pt-4">
          {moduleCompleted ? (
            <div className="flex items-center justify-center gap-3 py-4 bg-emerald-100/60 dark:bg-emerald-950/40 border border-emerald-300/50 dark:border-emerald-700/50 rounded-2xl">
              <span className="text-2xl">🎉</span>
              <div>
                <p className="font-semibold text-emerald-700 dark:text-emerald-300">Module completed!</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">Your progress is recorded. Start a simulation to practise.</p>
              </div>
              <Link
                to="/"
                className="ml-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                Start Simulation
              </Link>
            </div>
          ) : (
            <button
              onClick={onMarkComplete}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-2xl hover:from-purple-500 hover:to-pink-400 transition-all duration-200 shadow-lg shadow-purple-900/40"
            >
              Mark as Completed ✓
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default AwarenessModule
