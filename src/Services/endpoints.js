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

  // ADMIN section
  ADMIN: {
    DASHBOARD: {
      MAIN: '/api/v1/admin/dashboard/main-dashboard',
      PROFIT_AFTER_TAX: '/api/v1/admin/dashboard/profit-after-tax',
      TOP_PERFORMERS: '/api/v1/admin/dashboard/top-performers',
      SUBSCRIPTIONS: '/api/v1/admin/dashboard/subscriptions',
      HEATMAP: '/api/v1/admin/dashboard/heatmap',
      SUPPORT_TICKETS: '/api/v1/admin/dashboard/support-tickets',
      RENEWAL_ALERTS: '/api/v1/admin/dashboard/renewal-alerts',
    },
     CLIENTS: {
      CREATE: '/api/v1/admin/clients/create',
      // LIST: '/api/v1/admin/clients',
      // GET_BY_ID: (id) => `/api/v1/admin/clients/${id}`,
      // UPDATE: (id) => `/api/v1/admin/clients/${id}`,
      // DELETE: (id) => `/api/v1/admin/clients/${id}`,
    },
  },


};