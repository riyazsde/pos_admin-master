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
    ACCOUNT_SETTINGS: {
      DATE_TIME: '/api/v1/admin/account-settings/date-time',
      PROFILE: '/api/v1/user/getbyauth',
      SESSIONS: '/api/v1/admin/account-settings/sessions',
      REVOKE_SESSION: (id) => `/api/v1/admin/account-settings/sessions/${id}`,
      LOGIN_HISTORY: '/api/v1/admin/account-settings/login-history',
      SUSPICIOUS_ACTIVITY: '/api/v1/admin/account-settings/suspicious-activity',
      PASSWORD_RESET_LOGS: '/api/v1/admin/account-settings/password-reset-logs',
      API_KEYS: '/api/v1/admin/account-settings/api-keys',
      REVOKE_API_KEY: (id) =>
        `/api/v1/admin/account-settings/api-keys/${id}/revoke`,
      DELETE_API_KEY: (id) => `/api/v1/admin/account-settings/api-keys/${id}`,
      TRUSTED_DEVICES: '/api/v1/admin/account-settings/trusted-devices',
      REMOVE_TRUSTED_DEVICE: (id) =>
        `/api/v1/admin/account-settings/trusted-devices/${id}`,
    },

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
      GET_RENEWAL: (id) => `/api/v1/admin/clients/${id}/renewal`,
      SEND_RENEWAL_MESSAGE: (id) =>
        `/api/v1/admin/clients/${id}/renewal-message`,
      RESET_PASSWORD: (id) => `/api/v1/admin/clients/${id}/password`,
    },

    SUBSCRIPTION: {
      DASHBOARD: '/api/v1/admin/admin_plan/subscription-dashboard',
      GET_ALL: '/api/v1/admin/admin_plan/getall',
      GET_PUBLIC: '/api/v1/admin/admin_plan/public',
      GET_BY_ID: (id) => `/api/v1/admin/admin_plan/getbyid/${id}`,
      GET_BY_AUTH: '/api/v1/admin/admin_plan/getbyauth',
      CREATE: '/api/v1/admin/admin_plan/create',
      UPDATE: '/api/v1/admin/admin_plan/update',
      DELETE: (id) => `/api/v1/admin/admin_plan/delete/${id}`,
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

      REVENUE_REPORT: '/api/v1/admin/reports/revenue-report',
      LOW_STOCK_ALERTS: '/api/v1/admin/reports/low-stock-alerts',
      SUBSCRIPTION_REPORT: '/api/v1/admin/reports/subscription-report',
      RESTAURANT_DASHBOARD: '/api/v1/admin/restaurant-reports/dashboard',
      RESTAURANT_PERFORMANCE:
        '/api/v1/admin/restaurant-reports/getRestaurantPerformance',

      HARDWARE_INVENTORY:
        '/api/v1/admin/pos-hardware-devices/inventory-status',
      HARDWARE_SALES: '/api/v1/admin/pos-hardware-devices/sales-report',
    },

    AUDITS: {
      OVERVIEW: '/api/v1/admin/audits/dashboard/overview',
      ACTIVITY: '/api/v1/admin/audits/report/activity',
      GET_BY_ID: (id) => `/api/v1/admin/audits/getbyid/${id}`,
      EXPORT_SUMMARY: '/api/v1/admin/audits/report/export-summary',
    },

    POS_HARDWARE: {
      DASHBOARD: '/api/v1/admin/pos-hardware-devices/dashboard',
      INVENTORY_STATUS: '/api/v1/admin/pos-hardware-devices/inventory-status',
      SALES_REPORT: '/api/v1/admin/pos-hardware-devices/sales-report',
    },

    SUPPORT_TICKETS: {
      SUMMARY: '/api/v1/admin/dashboard/support-tickets/summary',
      LIST: '/api/v1/admin/dashboard/support-tickets',
      UPDATE: '/api/v1/restaurant/support_ticket/update',
      REPLY: '/api/v1/restaurant/support_ticket_reply/create',
      CHART: '/api/v1/restaurant/support_ticket/chart',
      ASSIGNABLE_USERS: '/api/v1/restaurant/support_ticket/assignable-users',
    },

    HAM: {
      MY_DEVICES: '/api/v1/master/myDevices/getall',
      CREATE_DEVICE: '/api/v1/master/myDevices/create',
      SOLD_IN_RESTAURANT:
        '/api/v1/admin/admin_pos_mydevices_sold_in_restaurant/getall',
    },

    MDM: {
      GET_ALL: '/api/v1/master/myDevices/getall',
      GET_BY_AUTH: '/api/v1/master/myDevices/getbyauth',
      SESSION_LOGS: (id) => `/api/v1/master/myDevices/${id}/session-logs`,
      SESSION_LOGS_EXPORT: (id) =>
        `/api/v1/master/myDevices/${id}/session-logs/export`,
      LOCK: (id) => `/api/v1/master/myDevices/${id}/lock`,
      UNLOCK: (id) => `/api/v1/master/myDevices/${id}/unlock`,
      RESTART: (id) => `/api/v1/master/myDevices/${id}/restart`,
      PUSH_UPDATE: (id) => `/api/v1/master/myDevices/${id}/push-update`,
      WIPE_SEND_OTP: (id) => `/api/v1/master/myDevices/${id}/wipe/send-otp`,
      WIPE: (id) => `/api/v1/master/myDevices/${id}/wipe`,
      WIPE_VERIFY: (id) => `/api/v1/master/myDevices/${id}/wipe`,
    },

    PAYMENT_OPTIONS: {
      GET_ALL: '/api/v1/admin/payment_options/getall',
      CREATE: '/api/v1/admin/payment_options/create',
      UPDATE: (id) => `/api/v1/admin/payment_options/update/${id}`,
      DELETE: (id) => `/api/v1/admin/payment_options/delete/${id}`,
    },

    // NEW — Employees
    USER: {
      EMPLOYEES_BY_CLIENT: (clientId) =>
        `/api/v1/user/employees/client/${clientId}`,
      EMPLOYEES_BY_RESTAURANT: (restaurantUserId) =>
        `/api/v1/user/employees/${restaurantUserId}`,
      EMPLOYEE_DETAILS_BY_ID: (employeeUserId) =>
        `/api/v1/user/employeedetailsbyid/${employeeUserId}`,
    },
  },

  MASTER: {
    CURRENCY: {
      GET_ALL: '/api/v1/master/currency/getall',
      CREATE: '/api/v1/master/currency/create',
    },
  },
};