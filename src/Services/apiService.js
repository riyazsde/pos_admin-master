// src/Services/apiService.js

import apiClient from './apiClient';
import { ENDPOINTS } from './endpoints';
import { clearAuth } from '../utils/authStorage';
import { store } from '../Store/store';
import { loginSuccess, logoutSuccess } from '../Store/Features/auth/authSlice';

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

    //  Dispatch Redux action (also saves to storage)
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
      // Dispatch Redux action (also clears storage)
      store.dispatch(logoutSuccess());
    }
  },
};

/**
 * Forgot Password Services
 */
export const forgotPasswordService = {
  sendOtp: async (email) => {
    const response = await apiClient.post(
      ENDPOINTS.AUTH.FORGOT_PASSWORD.SEND_OTP,
      { email }
    );
    return response.data;
  },

  verifyOtp: async (email, otp) => {
    const response = await apiClient.post(
      ENDPOINTS.AUTH.FORGOT_PASSWORD.VERIFY_OTP,
      { email, otp }
    );
    return response.data;
  },

  resetPassword: async (payload) => {
    const response = await apiClient.post(
      ENDPOINTS.AUTH.FORGOT_PASSWORD.RESET_PASSWORD,
      payload
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

  //  Profit After Tax
  getProfitAfterTax: async () => {
    const response = await apiClient.get(ENDPOINTS.ADMIN.DASHBOARD.PROFIT_AFTER_TAX);
    const payload = response.data;

    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load profit data');
    }

    return payload?.data || null;
  },

  // Top Performers (with pagination)
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
  // Subscriptions
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

//  Heatmap
getHeatmap: async () => {
  const response = await apiClient.get(ENDPOINTS.ADMIN.DASHBOARD.HEATMAP);
  const payload = response.data;

  if (payload?.success === false) {
    throw new Error(payload?.message || 'Failed to load heatmap');
  }

  return payload?.data || null;
},
// ✅ NEW: Support Tickets
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

// ✅ NEW: Renewal Alerts
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
// ✅ NEW: Single call to fetch all 4 dashboard widgets at once
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
// -------------- Client Services------------------------

export const clientService = {
  createClient: async (payload) => {
    const response = await apiClient.post(ENDPOINTS.ADMIN.CLIENTS.CREATE, payload);
    const data = response.data;
    if (data?.success === false) {
      throw new Error(data?.message || 'Failed to create client');
    }
    return data?.data || null;
  },

  // ✅ NEW: Get all clients
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

  // ✅ NEW: Get single client by ID
  getClientById: async (id) => {
    const response = await apiClient.get(ENDPOINTS.ADMIN.CLIENTS.GET_BY_ID(id));
    const payload = response.data;

    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load client details');
    }

    return payload?.data || null;
  },
};