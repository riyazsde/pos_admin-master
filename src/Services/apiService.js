// src/Services/apiService.js

import apiClient from './apiClient';
import { ENDPOINTS } from './endpoints';
import { clearAuth } from '../utils/authStorage';
import { store } from '../Store/store';
import { loginSuccess, logoutSuccess } from '../Store/Features/auth/authSlice';
import { getToken } from '../utils/authStorage';

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

    store.dispatch(
      loginSuccess({ token, user, rememberMe: credentials.rememberMe })
    );

    return { token, user };
  },

  logout: async () => {
    try {
      await apiClient.post(ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      store.dispatch(logoutSuccess());
    }
  },
};

export const forgotPasswordService = {
  sendOtp: async (email) => {
    const response = await apiClient.post(
      ENDPOINTS.AUTH.FORGOT_PASSWORD.SEND_OTP,
      { email }
    );
    return response.data;
  },

  resendOtp: async (email) => {
    const response = await apiClient.post(
      ENDPOINTS.AUTH.FORGOT_PASSWORD.RESEND_OTP,
      { email }
    );
    return response.data;
  },

  verifyOtp: async (email, otp, newPassword) => {
    const response = await apiClient.post(
      ENDPOINTS.AUTH.FORGOT_PASSWORD.VERIFY_OTP,
      { email, otp, newPassword }
    );
    return response.data;
  },
};

export const changePasswordService = {
  change: async (currentPassword, newPassword, reEnterPassword) => {
    const response = await apiClient.post(
      ENDPOINTS.AUTH.CHANGE_PASSWORD,
      { currentPassword, newPassword, reEnterPassword }
    );
    return response.data;
  },
};

/**
 * Admin Dashboard Services
 */
export const dashboardService = {
  getMainDashboard: async () => {
    const response = await apiClient.get(ENDPOINTS.ADMIN.DASHBOARD.MAIN);
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load dashboard');
    }
    return payload?.data || null;
  },

  getProfitAfterTax: async () => {
    const response = await apiClient.get(ENDPOINTS.ADMIN.DASHBOARD.PROFIT_AFTER_TAX);
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load profit data');
    }
    return payload?.data || null;
  },

  getTopPerformers: async (page = 1, limit = 10) => {
    const response = await apiClient.get(
      ENDPOINTS.ADMIN.DASHBOARD.TOP_PERFORMERS,
      { params: { page, limit } }
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load top performers');
    }
    return {
      data: payload?.data || [],
      pagination: payload?.pagination || null,
    };
  },

  getSubscriptions: async (page = 1, limit = 10) => {
    const response = await apiClient.get(
      ENDPOINTS.ADMIN.DASHBOARD.SUBSCRIPTIONS,
      { params: { page, limit } }
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load subscriptions');
    }
    return {
      data: payload?.data || [],
      pagination: payload?.pagination || null,
    };
  },

  getHeatmap: async () => {
    const response = await apiClient.get(ENDPOINTS.ADMIN.DASHBOARD.HEATMAP);
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load heatmap');
    }
    return payload?.data || null;
  },

  getSupportTickets: async (page = 1, limit = 5, status = 'Open') => {
    const response = await apiClient.get(
      ENDPOINTS.ADMIN.DASHBOARD.SUPPORT_TICKETS,
      { params: { page, limit, status } }
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load support tickets');
    }
    return {
      data: payload?.data || [],
      pagination: payload?.pagination || null,
    };
  },

  getRenewalAlerts: async (page = 1, limit = 10) => {
    const response = await apiClient.get(
      ENDPOINTS.ADMIN.DASHBOARD.RENEWAL_ALERTS,
      { params: { page, limit } }
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load renewal alerts');
    }
    return {
      data: payload?.data || [],
      pagination: payload?.pagination || null,
    };
  },

  getCompleteDashboard: async () => {
    const response = await apiClient.get(ENDPOINTS.ADMIN.DASHBOARD.COMPLETE);
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load complete dashboard');
    }
    const data = payload?.data || {};
    return {
      subscriptionsPurchased: data.subscriptionsPurchased || [],
      heatMap: data.heatMap || { title: '', data: [] },
      supportTickets: data.supportTickets || { title: '', count: 0, data: [] },
      renewalAlerts: data.renewalAlerts || { title: '', count: 0, data: [] },
    };
  },
};

/**
 * Client Services
 */
export const clientService = {
  createClient: async (payload) => {
    const response = await apiClient.post(ENDPOINTS.ADMIN.CLIENTS.CREATE, payload);
    const data = response.data;
    if (data?.success === false) {
      throw new Error(data?.message || 'Failed to create client');
    }
    return data?.data || null;
  },

  getAllClients: async () => {
    const response = await apiClient.get(ENDPOINTS.ADMIN.CLIENTS.GET_ALL);
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load clients');
    }
    return {
      data: payload?.data || [],
      count: payload?.count ?? (payload?.data?.length || 0),
    };
  },

  getClientById: async (id) => {
    const response = await apiClient.get(
      ENDPOINTS.ADMIN.CLIENTS.GET_BY_ID(id)
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load client details');
    }
    return payload?.data || null;
  },
};

/**
 * Subscription Services
 */
export const subscriptionService = {
  getSubscriptionDashboard: async () => {
    const response = await apiClient.get(
      ENDPOINTS.ADMIN.SUBSCRIPTION.DASHBOARD
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load subscription dashboard');
    }
    return payload?.data || null;
  },

  getAllPlans: async (subscriptionType) => {
    const params = {};
    if (subscriptionType) params.Subscription_Type = subscriptionType;
    const response = await apiClient.get(
      ENDPOINTS.ADMIN.SUBSCRIPTION.GET_ALL,
      { params }
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load plans');
    }
    return {
      data: payload?.data || [],
      count: payload?.count ?? (payload?.data?.length || 0),
    };
  },

  getPlanById: async (id) => {
    const response = await apiClient.get(
      ENDPOINTS.ADMIN.SUBSCRIPTION.GET_BY_ID(id)
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Plan not found');
    }
    return payload?.data || null;
  },

  getPlansByAuth: async () => {
    const response = await apiClient.get(
      ENDPOINTS.ADMIN.SUBSCRIPTION.GET_BY_AUTH
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load plans');
    }
    return {
      data: payload?.data || [],
      count: payload?.count ?? (payload?.data?.length || 0),
    };
  },

  createPlan: async (payload) => {
    const response = await apiClient.post(
      ENDPOINTS.ADMIN.SUBSCRIPTION.CREATE,
      payload
    );
    const data = response.data;
    if (data?.success === false) {
      throw new Error(data?.message || 'Failed to create plan');
    }
    return data?.data || null;
  },

  updatePlan: async (payload) => {
    const response = await apiClient.put(
      ENDPOINTS.ADMIN.SUBSCRIPTION.UPDATE,
      payload
    );
    const data = response.data;
    if (data?.success === false) {
      throw new Error(data?.message || 'Failed to update plan');
    }
    return data?.data || null;
  },

  getSubscriptionHistory: async (page = 1, limit = 10, status = 'all') => {
    const response = await apiClient.get(
      ENDPOINTS.ADMIN.SUBSCRIPTION.HISTORY,
      { params: { page, limit, status } }
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load subscription history');
    }
    return {
      data: payload?.data || [],
      pagination: payload?.pagination || null,
    };
  },
};

/**
 * Reports Services
 */
export const reportService = {
  getKpiDashboard: async () => {
    const response = await apiClient.get(ENDPOINTS.ADMIN.REPORTS.KPI_DASHBOARD);
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load KPI dashboard');
    }
    return payload?.data || null;
  },

  getActiveClients: async (page = 1, limit = 10, search = '') => {
    const response = await apiClient.get(
      ENDPOINTS.ADMIN.REPORTS.ACTIVE_CLIENTS,
      { params: { page, limit, search } }
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load active clients');
    }
    return {
      data: payload?.data || [],
      pagination: payload?.pagination || null,
    };
  },

  getInactiveClients: async (page = 1, limit = 10, search = '') => {
    const response = await apiClient.get(
      ENDPOINTS.ADMIN.REPORTS.INACTIVE_CLIENTS,
      { params: { page, limit, search } }
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load inactive clients');
    }
    return {
      data: payload?.data || [],
      pagination: payload?.pagination || null,
    };
  },

  getSubscriptionSales: async (month, year) => {
    const response = await apiClient.get(
      ENDPOINTS.ADMIN.REPORTS.SUBSCRIPTION_SALES,
      { params: { month, year } }
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load subscription sales');
    }
    return payload?.data || null;
  },

  getLatestTransactions: async (page = 1, limit = 20) => {
    const response = await apiClient.get(
      ENDPOINTS.ADMIN.REPORTS.LATEST_TRANSACTIONS,
      { params: { page, limit } }
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load transactions');
    }
    return {
      data: payload?.data || [],
      summary: payload?.summary || null,
      pagination: payload?.pagination || null,
    };
  },

  getTransactionGraph: async (months = 12) => {
    const response = await apiClient.get(
      ENDPOINTS.ADMIN.REPORTS.TRANSACTION_GRAPH,
      { params: { months } }
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load transaction graph');
    }
    return payload?.data || null;
  },

  getSupportTicketsReport: async (page = 1, limit = 10, status = 'Open') => {
    const response = await apiClient.get(
      ENDPOINTS.ADMIN.REPORTS.SUPPORT_TICKETS,
      { params: { page, limit, status } }
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load support tickets');
    }
    return {
      data: payload?.data || [],
      pagination: payload?.pagination || null,
    };
  },

  getCityWiseUsage: async (page = 1, limit = 20) => {
    const response = await apiClient.get(
      ENDPOINTS.ADMIN.REPORTS.CITY_WISE_USAGE,
      { params: { page, limit } }
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load city-wise usage');
    }
    return {
      data: payload?.data || [],
      summary: payload?.summary || null,
      pagination: payload?.pagination || null,
    };
  },
};

/**
 * Language Services
 */
export const languageService = {
  getAllLanguages: async () => {
    const response = await apiClient.get(ENDPOINTS.ADMIN.LANGUAGE.GET_ALL);
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load languages');
    }
    return {
      data: payload?.data || [],
      count: payload?.count ?? (payload?.data?.length || 0),
    };
  },
};

/**
 * Audit Services
 */
export const auditService = {
  getOverview: async () => {
    const response = await apiClient.get(ENDPOINTS.ADMIN.AUDITS.OVERVIEW);
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load audit overview');
    }
    return payload?.data || null;
  },

  getActivity: async ({
    page = 1,
    limit = 20,
    startDate,
    endDate,
    environment,
    action,
    ipAddress,
  } = {}) => {
    const params = { page, limit };
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (environment) params.environment = environment;
    if (action) params.action = action;
    if (ipAddress) params.ipAddress = ipAddress;

    const response = await apiClient.get(
      ENDPOINTS.ADMIN.AUDITS.ACTIVITY,
      { params }
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load audit activity');
    }
    return {
      data: payload?.data || [],
      pagination: payload?.pagination || null,
    };
  },

  getById: async (id) => {
    const response = await apiClient.get(
      ENDPOINTS.ADMIN.AUDITS.GET_BY_ID(id)
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Audit not found');
    }
    return payload?.data || null;
  },

  getExportSummary: async (startDate, endDate) => {
    const response = await apiClient.get(
      ENDPOINTS.ADMIN.AUDITS.EXPORT_SUMMARY,
      { params: { startDate, endDate } }
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to generate export');
    }
    return payload?.data || null;
  },
};

/**
 * POS Hardware Services
 */
export const posHardwareService = {
  getDashboard: async () => {
    const response = await apiClient.get(
      ENDPOINTS.ADMIN.POS_HARDWARE.DASHBOARD
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load POS hardware dashboard');
    }
    return payload?.data || null;
  },
};

/**
 * Support Ticket Services
 */
export const supportTicketService = {
  getSummary: async () => {
    const response = await apiClient.get(
      ENDPOINTS.ADMIN.SUPPORT_TICKETS.SUMMARY
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load ticket summary');
    }
    return payload?.data || null;
  },

  getTickets: async (page = 1, limit = 10, status = null) => {
    const params = { page, limit };
    if (status) params.status = status;

    const response = await apiClient.get(
      ENDPOINTS.ADMIN.SUPPORT_TICKETS.LIST,
      { params }
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load tickets');
    }
    return {
      data: payload?.data || [],
      pagination: payload?.pagination || null,
    };
  },

  updateTicketStatus: async (id, backendStatus) => {
    const response = await apiClient.put(
      ENDPOINTS.ADMIN.SUPPORT_TICKETS.UPDATE,
      { id, Ticket_status: backendStatus }
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to update ticket');
    }
    return payload?.data || null;
  },

  createReply: async ({
    support_ticket_id,
    reply,
    employee_id,
    Ticket_status,
    Status = true,
  }) => {
    const response = await apiClient.post(
      ENDPOINTS.ADMIN.SUPPORT_TICKETS.REPLY,
      { support_ticket_id, reply, employee_id, Ticket_status, Status }
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to submit reply');
    }
    return payload?.data || null;
  },

  getChart: async (filter = '1Month') => {
    const response = await apiClient.get(
      ENDPOINTS.ADMIN.SUPPORT_TICKETS.CHART,
      { params: { filter } }
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load chart');
    }
    return payload?.data || null;
  },
};

/**
 * Hardware Asset Management Services
 */
export const hamService = {
  getMyDevices: async () => {
    const response = await apiClient.get(ENDPOINTS.ADMIN.HAM.MY_DEVICES);
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load devices');
    }
    return {
      data: payload?.data || [],
      count: payload?.count ?? (payload?.data?.length || 0),
    };
  },

  getSoldInRestaurant: async () => {
    const response = await apiClient.get(
      ENDPOINTS.ADMIN.HAM.SOLD_IN_RESTAURANT
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load assigned devices');
    }
    return {
      data: payload?.data || [],
      count: payload?.count ?? (payload?.data?.length || 0),
    };
  },

  getInventoryStatus: async () => {
    const response = await apiClient.get(
      ENDPOINTS.ADMIN.HAM.INVENTORY_STATUS
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load inventory status');
    }
    return payload?.data || null;
  },

  createDevice: async (payload) => {
    const response = await apiClient.post(
      ENDPOINTS.ADMIN.HAM.CREATE_DEVICE,
      payload
    );
    const data = response.data;
    if (data?.success === false) {
      throw new Error(data?.message || 'Failed to create device');
    }
    return data?.data || null;
  },
};

/**
 * MDM Device Management Services
 */
export const mdmService = {
  // GET /api/v1/master/myDevices/getall
  // Returns: { data: Device[], count: number }
  getAllDevices: async () => {
    const response = await apiClient.get(ENDPOINTS.ADMIN.MDM.GET_ALL);
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load devices');
    }
    return {
      data: payload?.data || [],
      count: payload?.count ?? (payload?.data?.length || 0),
    };
  },

  // GET /api/v1/master/myDevices/getbyauth
  // Returns: Device[]
  getMyDevicesByAuth: async () => {
    const response = await apiClient.get(ENDPOINTS.ADMIN.MDM.GET_BY_AUTH);
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load devices');
    }
    return payload?.data || [];
  },

  // GET /api/v1/master/myDevices/:id/session-logs
  // API returns: { success, data: { device, logs: [...] } }
  // We return that exact shape so the modal can render device stats too.
  getSessionLogs: async (id) => {
    const response = await apiClient.get(
      ENDPOINTS.ADMIN.MDM.SESSION_LOGS(id)
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load session logs');
    }
    // Handle both possible shapes just in case
    if (Array.isArray(payload?.data)) {
      return { device: null, logs: payload.data };
    }
    return {
      device: payload?.data?.device || null,
      logs: payload?.data?.logs || [],
    };
  },

  // POST /api/v1/master/myDevices/:id/lock
  // Body: { reason }
  lockDevice: async (id, reason) => {
    const response = await apiClient.post(ENDPOINTS.ADMIN.MDM.LOCK(id), {
      reason,
    });
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to lock device');
    }
    return payload?.data || null;
  },

  // POST /api/v1/master/myDevices/:id/restart
  // Body: { Restart_Reason, Scheduled_Restart, Restart_Queue, ... }
  restartDevice: async (id, payload) => {
    const response = await apiClient.post(
      ENDPOINTS.ADMIN.MDM.RESTART(id),
      payload
    );
    const data = response.data;
    if (data?.success === false) {
      throw new Error(data?.message || 'Failed to restart device');
    }
    return data?.data || null;
  },

  // POST /api/v1/master/myDevices/:id/push-update
  // Body: { App_Version }
  pushUpdate: async (id, App_Version) => {
    const response = await apiClient.post(
      ENDPOINTS.ADMIN.MDM.PUSH_UPDATE(id),
      { App_Version }
    );
    const data = response.data;
    if (data?.success === false) {
      throw new Error(data?.message || 'Failed to push update');
    }
    return data?.data || null;
  },
  exportSessionLogs: async (id) => {
  const response = await apiClient.get(
    ENDPOINTS.ADMIN.MDM.SESSION_LOGS_EXPORT(id),
    {
      responseType: 'blob', // ✅ critical — tells axios not to parse JSON
    }
  );
  return response.data; // Blob
},

  // -------------------------------------------------------------------------
  // WIPE FLOW — 2 steps on the SAME endpoint
  // -------------------------------------------------------------------------

 // -------------------------------------------------------------------------
// WIPE FLOW — Two separate endpoints
// -------------------------------------------------------------------------

// STEP 1: Send OTP
// POST /api/v1/master/myDevices/:id/wipe/send-otp
wipeDevice: async (id, { email, password }) => {
  const response = await apiClient.post(
    ENDPOINTS.ADMIN.MDM.WIPE_SEND_OTP(id),
    { Email: email, password }   // keep the body — backend may still want creds
  );
  const data = response.data;
  if (data?.success === false) {
    throw new Error(data?.message || 'Failed to send OTP');
  }
  return data?.data || null;
},

// STEP 2: Verify OTP and wipe
// POST /api/v1/master/myDevices/:id/wipe
// Body: { otp, wipeMode }  ← lowercase keys as per your backend
verifyWipeDevice: async (id, { otp, mode }) => {
  const response = await apiClient.post(ENDPOINTS.ADMIN.MDM.WIPE_VERIFY(id), {
    otp: String(otp).trim(),   // ✅ lowercase otp
    wipeMode: mode,            // ✅ camelCase wipeMode
  });
  const data = response.data;
  if (data?.success === false) {
    throw new Error(data?.message || 'Failed to verify wipe');
  }
  return data?.data || null;
},
  // -------------------------------------------------------------------------
  // ENROLL (Create new device)
  // POST /api/v1/master/myDevices/create
  // -------------------------------------------------------------------------
  enrollDevice: async (formData) => {
    const response = await apiClient.post(
      ENDPOINTS.ADMIN.HAM.CREATE_DEVICE,
      formData
    );
    const data = response.data;
    if (data?.success === false) {
      throw new Error(data?.message || 'Failed to enroll device');
    }
    return data?.data || null;
  },
};


/**
 * SubAdmin Services
 */
export const subadminService = {
  getAll: async ({ page = 1, limit = 10, status = true, search = '' } = {}) => {
    const params = { page, limit };
    if (status !== undefined && status !== null) params.Status = status;
    if (search) params.search = search;

    const response = await apiClient.get(
      ENDPOINTS.ADMIN.SUBADMIN.GET_ALL,
      { params }
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load subadmins');
    }
    return {
      data: payload?.data || [],
      pagination: payload?.pagination || null,
    };
  },

  getByAuth: async () => {
    const response = await apiClient.get(
      ENDPOINTS.ADMIN.SUBADMIN.GET_BY_AUTH
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load profile');
    }
    return payload?.data || null;
  },

  update: async (id, payload) => {
    const url = ENDPOINTS.ADMIN.SUBADMIN.UPDATE(id);
    const response = await apiClient.put(url, payload);
    const data = response.data;
    if (data?.success === false) {
      throw new Error(data?.message || 'Failed to update subadmin');
    }
    return data?.data || null;
  },

  create: async (payload) => {
    const response = await apiClient.post(
      ENDPOINTS.ADMIN.SUBADMIN.CREATE,
      payload
    );
    const data = response.data;
    if (data?.success === false) {
      throw new Error(data?.message || 'Failed to create subadmin');
    }
    return data?.data || null;
  },

  remove: async (id) => {
  const response = await apiClient.delete(
    ENDPOINTS.ADMIN.PAYMENT_OPTIONS.DELETE(id)  // ✅ Correct endpoint
  );
  const data = response.data;
  if (data?.success === false) {
    throw new Error(data?.message || 'Failed to delete payment option');
  }
  return data?.data || null;
},

  deactivate: async (id) => {
    const response = await apiClient.patch(
      ENDPOINTS.ADMIN.SUBADMIN.DEACTIVATE(id),
      {}
    );
    const data = response.data;
    if (data?.success === false) {
      throw new Error(data?.message || 'Failed to deactivate subadmin');
    }
    return data?.data || null;
  },

  activate: async (id) => {
    const response = await apiClient.patch(
      ENDPOINTS.ADMIN.SUBADMIN.ACTIVATE(id),
      {}
    );
    const data = response.data;
    if (data?.success === false) {
      throw new Error(data?.message || 'Failed to activate subadmin');
    }
    return data?.data || null;
  },
};

/**
 * ✅ Account Settings Services
 */
export const accountSettingsService = {
  // ---------- Profile ----------
  getProfile: async () => {
    const response = await apiClient.get(
      ENDPOINTS.ADMIN.ACCOUNT_SETTINGS.PROFILE
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load profile');
    }
    return payload?.data || null;
  },

  // ---------- Date & Time ----------
  getDateTime: async () => {
    const response = await apiClient.get(
      ENDPOINTS.ADMIN.ACCOUNT_SETTINGS.DATE_TIME
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load date/time settings');
    }
    return payload?.data || null;
  },
updateDateTime: async (payload) => {
  const url = ENDPOINTS.ADMIN.ACCOUNT_SETTINGS.DATE_TIME;

  console.log('🟢 updateDateTime PUT URL:', `${apiClient.defaults.baseURL}${url}`);
  console.log('🟢 updateDateTime payload:', payload);

  const response = await apiClient.put(url, payload); // ✅ PUT, not POST
  const data = response.data;

  if (data?.success === false) {
    throw new Error(data?.message || 'Failed to update date/time settings');
  }

  return data?.data || null;
},

  // ---------- Active Sessions ----------
  getSessions: async () => {
    const response = await apiClient.get(
      ENDPOINTS.ADMIN.ACCOUNT_SETTINGS.SESSIONS
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load sessions');
    }
    return payload?.data || [];
  },

  revokeSession: async (sessionId) => {
    const response = await apiClient.delete(
      ENDPOINTS.ADMIN.ACCOUNT_SETTINGS.REVOKE_SESSION(sessionId)
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to revoke session');
    }
    return payload;
  },

  // ---------- Login History ----------
  getLoginHistory: async (page = 1, limit = 20) => {
    const response = await apiClient.get(
      ENDPOINTS.ADMIN.ACCOUNT_SETTINGS.LOGIN_HISTORY,
      { params: { page, limit } }
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load login history');
    }
    return {
      data: payload?.data || [],
      pagination: payload?.pagination || null,
    };
  },

  // ---------- Suspicious Activity ----------
  getSuspiciousActivity: async (page = 1, limit = 20) => {
    const response = await apiClient.get(
      ENDPOINTS.ADMIN.ACCOUNT_SETTINGS.SUSPICIOUS_ACTIVITY,
      { params: { page, limit } }
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load suspicious activity');
    }
    return {
      data: payload?.data || [],
      pagination: payload?.pagination || null,
    };
  },

  // ---------- Password Reset Logs ----------
  getPasswordResetLogs: async (page = 1, limit = 20) => {
    const response = await apiClient.get(
      ENDPOINTS.ADMIN.ACCOUNT_SETTINGS.PASSWORD_RESET_LOGS,
      { params: { page, limit } }
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load password reset logs');
    }
    return {
      data: payload?.data || [],
      pagination: payload?.pagination || null,
    };
  },

  // ---------- API Keys ----------
  getApiKeys: async () => {
    const response = await apiClient.get(
      ENDPOINTS.ADMIN.ACCOUNT_SETTINGS.API_KEYS
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load API keys');
    }
    return payload?.data || [];
  },

  createApiKey: async ({ name, environment = 'Production', permissions = ['read'] }) => {
    const response = await apiClient.post(
      ENDPOINTS.ADMIN.ACCOUNT_SETTINGS.API_KEYS,
      { name, environment, permissions }
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to create API key');
    }
    return {
      data: payload?.data || null,
      warning: payload?.warning || null,
    };
  },

  revokeApiKey: async (keyId) => {
    const url = ENDPOINTS.ADMIN.ACCOUNT_SETTINGS.REVOKE_API_KEY(keyId);
    const response = await apiClient.post(url, {});
    return response.data?.data || null;
  },

  deleteApiKey: async (keyId) => {
    const response = await apiClient.delete(
      ENDPOINTS.ADMIN.ACCOUNT_SETTINGS.DELETE_API_KEY(keyId)
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to delete API key');
    }
    return payload;
  },

  // ---------- Trusted Devices ----------
  getTrustedDevices: async () => {
    const response = await apiClient.get(
      ENDPOINTS.ADMIN.ACCOUNT_SETTINGS.TRUSTED_DEVICES
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load trusted devices');
    }
    return payload?.data || [];
  },

addTrustedDevice: async ({ device_name, device_type }) => {
  const payload = {
    name: device_name,
    type: device_type,
  };
  console.log(' addTrustedDevice payload:', JSON.stringify(payload));

  const response = await apiClient.post(
    ENDPOINTS.ADMIN.ACCOUNT_SETTINGS.TRUSTED_DEVICES,
    payload
  );
  const data = response.data;
  if (data?.success === false) {
    throw new Error(data?.message || 'Failed to add device');
  }
  return data?.data || null;
},

  removeTrustedDevice: async (deviceId) => {
    const response = await apiClient.delete(
      ENDPOINTS.ADMIN.ACCOUNT_SETTINGS.REMOVE_TRUSTED_DEVICE(deviceId)
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to remove device');
    }
    return payload;
  },
};

/**
 * Currency Services
 */
export const currencyService = {
  getAll: async () => {
    const response = await apiClient.get(ENDPOINTS.MASTER.CURRENCY.GET_ALL);
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load currencies');
    }
    return {
      data: payload?.data || [],
      count: payload?.count ?? (payload?.data?.length || 0),
    };
  },

  create: async (payload) => {
    const response = await apiClient.post(
      ENDPOINTS.MASTER.CURRENCY.CREATE,
      payload
    );
    const data = response.data;
    if (data?.success === false) {
      throw new Error(data?.message || 'Failed to create currency');
    }
    return data?.data || null;
  },
};

/**
 * Payment Options Services
 */
export const paymentOptionService = {
  getAll: async () => {
    const response = await apiClient.get(
      ENDPOINTS.ADMIN.PAYMENT_OPTIONS.GET_ALL
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load payment options');
    }
    return {
      data: payload?.data || [],
      count: payload?.count ?? (payload?.data?.length || 0),
    };
  },

  create: async ({ option, details, status = true }) => {
    const response = await apiClient.post(
      ENDPOINTS.ADMIN.PAYMENT_OPTIONS.CREATE,
      {
        PaymentOption: [{ option, Details: details }],
        Status: status,
      }
    );
    const data = response.data;
    if (data?.success === false) {
      throw new Error(data?.message || 'Failed to create payment option');
    }
    return data?.data || null;
  },

  update: async (id, { option, details, status = true }) => {
    const response = await apiClient.put(
      ENDPOINTS.ADMIN.PAYMENT_OPTIONS.UPDATE(id),
      {
        PaymentOption: [{ option, Details: details }],
        Status: status,
      }
    );
    const data = response.data;
    if (data?.success === false) {
      throw new Error(data?.message || 'Failed to update payment option');
    }
    return data?.data || null;
  },

  remove: async (id) => {
    const response = await apiClient.delete(
      ENDPOINTS.ADMIN.PAYMENT_OPTIONS.DELETE(id)
    );
    const data = response.data;
    if (data?.success === false) {
      throw new Error(data?.message || 'Failed to delete payment option');
    }
    return data?.data || null;
  },
};