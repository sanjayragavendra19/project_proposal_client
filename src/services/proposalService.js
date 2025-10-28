import axios from 'axios';

// Centralized API base URL
const API_BASE_URL = `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8081'}/api/proposals`;

const defaultHeaders = {
  'Content-Type': 'application/json',
  'X-Requested-With': 'XMLHttpRequest'
};

const proposalService = {
  getAll: async (username = null) => {
    const params = username ? { username } : {};
    return axios.get(API_BASE_URL, { params });
  },

  create: async (proposal, username = null) => {
    const url = username ? `${API_BASE_URL}?username=${username}` : API_BASE_URL;
    return axios.post(url, proposal, { headers: defaultHeaders });
  },

  update: async (id, proposal, username = null) => {
    const url = username ? `${API_BASE_URL}/${id}?username=${username}` : `${API_BASE_URL}/${id}`;
    return axios.put(url, proposal, { headers: defaultHeaders });
  },

  delete: async (id, username = null) => {
    const url = username ? `${API_BASE_URL}/${id}?username=${username}` : `${API_BASE_URL}/${id}`;
    return axios.delete(url);
  },

  testConnection: async () => {
    return axios.get(API_BASE_URL, { timeout: 5000 });
  },

  addReviewerComment: async (id, reviewData) => {
    return axios.put(`${API_BASE_URL}/${id}/review`, reviewData, {
      headers: { 'Content-Type': 'application/json' },
    });
  },

  getTrash: async () => {
    return axios.get(`${API_BASE_URL}/trash`);
  },

  restore: async (id) => {
    return axios.put(`${API_BASE_URL}/${id}/restore`);
  },
};

export default proposalService;
