import api from './authService'

export const giveService = {
  // Get all public gives (masked data)
  getAllGives: (params = {}) => {
    return api.get('/gives/', { params })
  },

  // Get user's own gives (full data)
  getMyGives: (params = {}) => {
    return api.get('/gives/my/', { params })
  },

  // Get all gives (admin only)
  getAllGivesAdmin: (params = {}) => {
    return api.get('/gives/all/', { params })
  },

  // Get specific give
  getGive: (id) => {
    return api.get(`/gives/${id}/`)
  },

  // Create new give
  createGive: (data) => {
    return api.post('/gives/my/', data)
  },

  // Update give
  updateGive: (id, data) => {
    return api.put(`/gives/${id}/`, data)
  },

  // Delete give
  deleteGive: (id) => {
    return api.delete(`/gives/${id}/`)
  },

  // Get contact info for give creator
  getContactInfo: (id) => {
    return api.get(`/gives/${id}/contact/`)
  },

  // Toggle give status
  toggleStatus: (id) => {
    return api.post(`/gives/${id}/toggle/`)
  },

  // Get gives statistics
  getStats: () => {
    return api.get('/gives/stats/')
  },

  // Get all gives for a specific user (admin only)
  getUserGives: (userId) => {
    return api.get(`/gives/all/?user=${userId}`)
  },
}

export default giveService 