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
      COMPLETE: '/api/v1/admin/dashboard/complete-dashboard',
    },
    CLIENTS: {
      CREATE: '/api/v1/admin/clients/create',
      GET_ALL: '/api/v1/admin/clients/getall',
      GET_BY_ID: (id) => `/api/v1/admin/clients/getbyid/${id}`,
      // UPDATE: (id) => `/api/v1/admin/clients/${id}`,
      // DELETE: (id) => `/api/v1/admin/clients/${id}`,
    },
     SUBSCRIPTION: {
    DASHBOARD: '/api/v1/admin/admin_plan/subscription-dashboard',  
     CREATE: '/api/v1/admin/admin_plan/create', 
      GET_ALL: '/api/v1/admin/admin_plan/getall',  
      HISTORY: '/api/v1/admin/subscription-history/listing', 
  },
    REPORTS: {
      KPI_DASHBOARD: '/api/v1/admin/reports/kpi-dashboard',
      ACTIVE_CLIENTS: '/api/v1/admin/reports/active-clients',
      INACTIVE_CLIENTS: '/api/v1/admin/reports/inactive-clients',
      SUBSCRIPTION_SALES: '/api/v1/admin/reports/subscription-sales',
      LATEST_TRANSACTIONS: '/api/v1/admin/reports/latest-transactions',
      TRANSACTION_GRAPH: '/api/v1/admin/reports/transaction-graph',
       SUPPORT_TICKETS: '/api/v1/admin/reports/support-tickets', 
        CITY_WISE_USAGE: '/api/v1/admin/reports/city-wise-usage', 
    },

  },


};