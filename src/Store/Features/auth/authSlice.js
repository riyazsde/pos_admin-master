// src/Features/auth/authSlice.js

import { createSlice } from '@reduxjs/toolkit';
import {
  getToken,
  getUser,
  saveAuth,
  clearAuth,
  isAuthenticated,
} from '../../../utils/authStorage';

// ✅ Initialize state from storage (so refresh keeps you logged in)
const initialState = {
  user: getUser(),
  token: getToken(),
  isAuthenticated: isAuthenticated(),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Called after successful login.
     * payload = { token, user, rememberMe }
     */
    loginSuccess: (state, action) => {
      const { token, user, rememberMe } = action.payload;
      saveAuth(token, user, rememberMe);
      state.token = token;
      state.user = user;
      state.isAuthenticated = true;
      state.error = null;
    },

    /**
     * Called on logout (or 401).
     */
    logoutSuccess: (state) => {
      clearAuth();
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },

    /**
     * Set loading state while an API call is in flight.
     */
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    /**
     * Set error message.
     */
    setError: (state, action) => {
      state.error = action.payload;
    },

    /**
     * Update user data (e.g., after profile edit).
     */
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      const storage = localStorage.getItem('token') ? localStorage : sessionStorage;
      storage.setItem('user', JSON.stringify(state.user));
    },
  },
});

export const {
  loginSuccess,
  logoutSuccess,
  setLoading,
  setError,
  updateUser,
} = authSlice.actions;

export default authSlice.reducer;