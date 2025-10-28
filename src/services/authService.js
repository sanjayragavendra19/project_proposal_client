import axios from 'axios';

const API_URL = `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8081'}/api`;

const authService = {
  login: async (credentials) => {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('username', response.data.username);
    }
    return response.data;
  },

  register: async (userData) => {
    return await axios.post(`${API_URL}/auth/register`, userData);
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
  },

  getCurrentUser: () => {
    return {
      token: localStorage.getItem('token'),
      role: localStorage.getItem('role'),
      username: localStorage.getItem('username')
    };
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  isAdmin: () => {
    return localStorage.getItem('role') === 'ADMIN';
  },

  isStudent: () => {
    return localStorage.getItem('role') === 'STUDENT';
  }
};

export default authService;