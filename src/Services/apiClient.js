// src/Services/apiClient.js

import axios from 'axios';
import { getToken } from '../utils/authStorage';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASEL_SERVER_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// ✅ Attach token
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

// ✅ Handle 401 globally — dispatch logout action to Redux
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Lazy import to avoid circular dependency
      const { store } = await import('../Store/store');
      const { logoutSuccess } = await import('../Store/Features/auth/authSlice');

      store.dispatch(logoutSuccess());

      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;