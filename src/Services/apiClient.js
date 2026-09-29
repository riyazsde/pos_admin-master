// src/Services/apiClient.js

import axios from 'axios';
import { getToken, clearAuth } from '../utils/authStorage';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASEL_SERVER_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token from localStorage OR sessionStorage
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuth();
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;