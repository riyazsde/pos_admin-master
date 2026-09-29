// src/Services/endpoints.js

export const ENDPOINTS = {
  AUTH: {
    LOGIN: (userType) => {
      switch (userType) {
        case 'Admin':
          return '/api/v1/user/login-admin';
        case 'Restaurant':
          return '/api/v1/user/login-restaurant';
        case 'Employee':
          return '/api/v1/user/login-employee';
        default:
          return '/api/v1/user/login-admin';
      }
    },
    LOGOUT: '/api/v1/user/logout',
    FORGOT_PASSWORD: {
      SEND_OTP: '/api/v1/user/forget-password/send-otp',
      VERIFY_OTP: '/api/v1/user/forget-password/verify-otp',
      RESET_PASSWORD: '/api/v1/user/forget-password/reset-password',
    },
  },

  // ✅ ADMIN section — MUST be present
  ADMIN: {
    DASHBOARD: {
      MAIN: '/api/v1/admin/dashboard/main-dashboard',
    },
  },
};