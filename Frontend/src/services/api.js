import axios from 'axios'

const getBaseURL = () => {
  if (import.meta.env.PROD) {
    return 'https://nlp-project-06lg.onrender.com/api'
  }
  return '/api'
}

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url, config.data)
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data)
    return Promise.reject(error)
  }
)

// ─── User ─────────────────────────────────────────────────────────────────────

export const userAPI = {
  init: (userId) =>
    api.post('/user/init', { user_id: userId }).then((r) => r.data),

  getStats: (userId) =>
    api.get(`/user/${userId}/stats`).then((r) => r.data),

  markModuleComplete: (userId) =>
    api.post(`/user/${userId}/module-complete`).then((r) => r.data),
}

// ─── Session ──────────────────────────────────────────────────────────────────

export const sessionAPI = {
  start: (userId, persona, awarenessCompleted) =>
    api
      .post('/session/start', {
        user_id: userId,
        persona,
        awareness_completed: awarenessCompleted,
      })
      .then((r) => r.data),

  reveal: (sessionId, userGuess) =>
    api
      .post(`/session/${sessionId}/reveal`, { user_guess: userGuess })
      .then((r) => r.data),
}

// ─── Chat ─────────────────────────────────────────────────────────────────────

export const chatAPI = {
  sendMessage: (persona, sessionId, message) =>
    api
      .post(`/chat/${persona}`, { session_id: sessionId, message })
      .then((r) => r.data),

  healthCheck: () => api.get('/health').then((r) => r.data),
}

export default api
