import axios from 'axios'

// Determine API base URL based on environment
const getBaseURL = () => {
  // In production (Vercel), use the Render backend URL
  // In development, use relative path (Vite proxy will handle it)
  if (import.meta.env.PROD) {
    return 'https://nlp-project-06lg.onrender.com/api'
  }
  return '/api'
}

// Create axios instance with default configuration
const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url, config.data)
    return config
  },
  (error) => {
    console.error('API Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data)
    return response
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.response?.data)
    return Promise.reject(error)
  }
)

// Chat API functions
export const chatAPI = {
  // Send message to chatbot with persona support
  sendMessage: async (message, conversationHistory = [], persona = 'singlish') => {
    try {
      const endpoint = `/chat/${persona}`
      const response = await api.post(endpoint, {
        message: message,
        conversation_history: conversationHistory
      })
      return response.data
    } catch (error) {
      console.error('Send message error:', error)
      throw error
    }
  },

  // Check API health
  healthCheck: async () => {
    try {
      const response = await api.get('/health')
      return response.data
    } catch (error) {
      console.error('Health check error:', error)
      throw error
    }
  }
}

export default api