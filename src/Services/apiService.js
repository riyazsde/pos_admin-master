// src/Services/apiService.js

import apiClient from './apiClient';
import { ENDPOINTS } from './endpoints';
import { saveAuth, clearAuth } from '../utils/authStorage';

/**
 * Auth Services
 */
export const authService = {
  login: async (userType, credentials) => {
    const endpoint = ENDPOINTS.AUTH.LOGIN(userType);
    const response = await apiClient.post(endpoint, credentials);
    const payload = response.data;

    if (payload?.success === false) {
      throw new Error(payload?.message || payload?.error || 'Login failed');
    }

    const token = payload?.data?.token;
    const user = payload?.data?.user;

    if (!token) throw new Error('No token received from server');

    saveAuth(token, user, credentials.rememberMe);

    return { token, user };
  },

  logout: async () => {
    try {
      await apiClient.post(ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      clearAuth();
    }
  },
};

/**
 * Forgot Password Services
 */
export const forgotPasswordService = {
  /**
   * Send OTP to the user's registered email.
   * @param {string} email
   */
  sendOtp: async (email) => {
    const response = await apiClient.post(
      ENDPOINTS.AUTH.FORGOT_PASSWORD.SEND_OTP,
      { email }
    );
    return response.data;
  },

  /**
   * Verify the OTP entered by the user.
   * @param {string} email
   * @param {string} otp
   */
  verifyOtp: async (email, otp) => {
    const response = await apiClient.post(
      ENDPOINTS.AUTH.FORGOT_PASSWORD.VERIFY_OTP,
      { email, otp }
    );
    return response.data;
  },

  /**
   * Reset password after OTP is verified.
   * @param {object} payload - { email, otp, newPassword, confirmPassword }
   */
  resetPassword: async (payload) => {
    const response = await apiClient.post(
      ENDPOINTS.AUTH.FORGOT_PASSWORD.RESET_PASSWORD,
      payload
    );
    return response.data;
  },
};