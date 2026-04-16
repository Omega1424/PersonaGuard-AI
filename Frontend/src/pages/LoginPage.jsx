import React, { useState } from 'react'
import { authAPI } from '../services/api'

const STORAGE_USER_ID = 'personaguard_user_id'
const STORAGE_USERNAME = 'personaguard_username'

function LoginPage({ onSuccess }) {
  const [tab, setTab] = useState('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const switchTab = (t) => {
    setTab(t)
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const u = username.trim()
    if (!u || !password) return
    setError('')
    setLoading(true)
    try {
      const data =
        tab === 'login'
          ? await authAPI.login(u, password)
          : await authAPI.register(u, password)
      localStorage.setItem(STORAGE_USER_ID, data.user_id)
      localStorage.setItem(STORAGE_USERNAME, data.username)
      onSuccess(data.user_id, data.username)
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong — try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0d0521] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl flex items-center justify-center mb-3 shadow-xl shadow-purple-900/60">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">PersonaGuard AI</h1>
          <p className="text-sm text-purple-300/60 mt-1">Scam detection training</p>
        </div>

        {/* Card */}
        <div className="bg-[#120b2e] border border-purple-800/50 rounded-2xl p-6 shadow-2xl shadow-purple-900/40">

          {/* Tabs */}
          <div className="flex bg-purple-950/60 rounded-xl p-1 mb-5">
            {[
              { key: 'login', label: 'Log in' },
              { key: 'register', label: 'Register' },
            ].map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => switchTab(key)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  tab === key
                    ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md'
                    : 'text-purple-400 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-purple-300 mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. john_doe"
                autoComplete="username"
                className="w-full px-4 py-2.5 bg-purple-950/60 border border-purple-700/50 text-white rounded-xl text-sm placeholder-purple-500/50 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-purple-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete={tab === 'register' ? 'new-password' : 'current-password'}
                className="w-full px-4 py-2.5 bg-purple-950/60 border border-purple-700/50 text-white rounded-xl text-sm placeholder-purple-500/50 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all"
              />
              {tab === 'register' && (
                <p className="text-xs text-purple-500/60 mt-1">Minimum 6 characters</p>
              )}
            </div>

            {error && (
              <p className="text-red-400 text-xs bg-red-950/40 border border-red-700/40 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !username.trim() || !password}
              className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-pink-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-purple-900/40 mt-2"
            >
              {loading
                ? 'Please wait…'
                : tab === 'login'
                ? 'Log in'
                : 'Create account'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-purple-500/50 mt-5">
          Your progress and stats are saved to your account.
        </p>
      </div>
    </div>
  )
}

export default LoginPage
