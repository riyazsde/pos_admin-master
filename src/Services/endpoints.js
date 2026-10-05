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
    CHANGE_PASSWORD: '/api/v1/user/change-password',

    FORGOT_PASSWORD: {
      SEND_OTP: '/api/v1/user/forget-password/send-otp',
      RESEND_OTP: '/api/v1/user/forget-password/resend-otp',
      VERIFY_OTP: '/api/v1/user/forget-password/verify-otp',
    },
  },

  // ----------------------------- ADMIN -----------------------------
  ADMIN: {
    LANGUAGE: {
      GET_ALL: '/api/v1/admin/language/getall',
    },

    SUBADMIN: {
      GET_ALL: '/api/v1/admin/subadmin/getall',
      GET_BY_AUTH: '/api/v1/admin/subadmin/getbyauth',
      CREATE: '/api/v1/admin/subadmin/create',
      UPDATE: (id) => `/api/v1/admin/subadmin/update/${id}`,
      DELETE: (id) => `/api/v1/admin/subadmin/delete/${id}`,
      DEACTIVATE: (id) => `/api/v1/admin/subadmin/deactivate/${id}`,
      ACTIVATE: (id) => `/api/v1/admin/subadmin/activate/${id}`,
    },

    //  Account Settings
    ACCOUNT_SETTINGS: {
      DATE_TIME: '/api/v1/admin/account-settings/date-time',
      PROFILE: '/api/v1/user/getbyauth',
    },

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
    },

    SUBSCRIPTION: {
      DASHBOARD: '/api/v1/admin/admin_plan/subscription-dashboard',
      GET_ALL: '/api/v1/admin/admin_plan/getall',
      GET_BY_ID: (id) => `/api/v1/admin/admin_plan/getbyid/${id}`,
      GET_BY_AUTH: '/api/v1/admin/admin_plan/getbyauth',
      CREATE: '/api/v1/admin/admin_plan/create',
      UPDATE: '/api/v1/admin/admin_plan/update',
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

    AUDITS: {
      OVERVIEW: '/api/v1/admin/audits/dashboard/overview',
      ACTIVITY: '/api/v1/admin/audits/report/activity',
      GET_BY_ID: (id) => `/api/v1/admin/audits/getbyid/${id}`,
      EXPORT_SUMMARY: '/api/v1/admin/audits/report/export-summary',
    },

    POS_HARDWARE: {
      DASHBOARD: '/api/v1/admin/pos-hardware-devices/dashboard',
    },

    SUPPORT_TICKETS: {
      SUMMARY: '/api/v1/admin/dashboard/support-tickets/summary',
      LIST: '/api/v1/admin/dashboard/support-tickets',
      UPDATE: '/api/v1/restaurant/support_ticket/update',
      REPLY: '/api/v1/restaurant/support_ticket_reply/create',
      CHART: '/api/v1/restaurant/support_ticket/chart',
    },

    HAM: {
      MY_DEVICES: '/api/v1/master/myDevices/getall',
      CREATE_DEVICE: '/api/v1/master/myDevices/create',
      SOLD_IN_RESTAURANT:
        '/api/v1/admin/admin_pos_mydevices_sold_in_restaurant/getall',
      INVENTORY_STATUS: '/api/v1/admin/pos-hardware-devices/inventory-status',
    },

    MDM: {
      GET_ALL: '/api/v1/master/myDevices/getall',
      GET_BY_AUTH: '/api/v1/master/myDevices/getbyauth',
      SESSION_LOGS: (id) => `/api/v1/master/myDevices/${id}/session-logs`,
      SESSION_LOGS_EXPORT: (id) =>
        `/api/v1/master/myDevices/${id}/session-logs/export`,
      LOCK: (id) => `/api/v1/master/myDevices/${id}/lock`,
      RESTART: (id) => `/api/v1/master/myDevices/${id}/restart`,
      PUSH_UPDATE: (id) => `/api/v1/master/myDevices/${id}/push-update`,
      WIPE: (id) => `/api/v1/master/myDevices/${id}/wipe`,
      WIPE_VERIFY: (id) => `/api/v1/master/myDevices/${id}/wipe`,
    },
  },

  // MASTER data (currencies, etc.)
  MASTER: {
    CURRENCY: {
      GET_ALL: '/api/v1/master/currency/getall',
      CREATE: '/api/v1/master/currency/create',
    },
  },
};