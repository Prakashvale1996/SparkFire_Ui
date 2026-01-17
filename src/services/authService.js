import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Auth API
export const authAPI = {
  // User registration
  register: async (userData) => {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
    return response.data;
  },

  // User login
  login: async (credentials) => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
    return response.data;
  },

  // Admin login
  adminLogin: async (credentials) => {
    const response = await axios.post(`${API_BASE_URL}/auth/admin/login`, credentials);
    return response.data;
  },

  // Create admin (only for initial setup)
  createAdmin: async (userData) => {
    const response = await axios.post(`${API_BASE_URL}/auth/create-admin`, userData);
    return response.data;
  },
};
