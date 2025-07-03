import axios from 'axios'

const API_BASE_URL = '/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refresh_token')
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
            refresh: refreshToken,
          })
          
          const { access } = response.data
          localStorage.setItem('access_token', access)
          api.defaults.headers.Authorization = `Bearer ${access}`
          
          return api(originalRequest)
        }
      } catch (refreshError) {
        // Refresh token failed, redirect to login
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export const authService = {
  setAuthToken: (token) => {
    api.defaults.headers.Authorization = `Bearer ${token}`
  },

  removeAuthToken: () => {
    delete api.defaults.headers.Authorization
  },

  login: (credentials) => {
    return api.post('/login/', credentials)
  },

  logout: (data) => {
    return api.post('/logout/', data)
  },

  getProfile: () => {
    return api.get('/profile/')
  },

  updateProfile: (data) => {
    if (data instanceof FormData) {
      return api.put('/profile/', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return api.put('/profile/', data);
  },

  getUserStats: () => {
    return api.get('/stats/')
  },

  getLeaderboard: (period = 'all') => {
    return api.get(`/leaderboard/?period=${period}`)
  },

  getUsers: () => {
    return api.get('/users/')
  },

  createUser: (data) => {
    return api.post('/users/register/', data)
  },

  updateUser: (id, data) => {
    return api.put(`/users/${id}/`, data)
  },

  deleteUser: (id) => {
    return api.delete(`/users/${id}/`)
  },
}

export default api 