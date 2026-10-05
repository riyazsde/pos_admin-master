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
export const forgotPasswordService = {
  // Send OTP
  sendOtp: async (email) => {
    const response = await apiClient.post(
      ENDPOINTS.AUTH.FORGOT_PASSWORD.SEND_OTP,
      { email }
    );
    return response.data;
  },

  // ✅ NEW: Resend OTP
  resendOtp: async (email) => {
    const response = await apiClient.post(
      ENDPOINTS.AUTH.FORGOT_PASSWORD.RESEND_OTP,
      { email }
    );
    return response.data;
  },

  // ✅ Verify OTP + set new password (combined in backend)
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
 * Forgot Password Services
 */



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

// --------------------subscription service------------------

// src/Services/apiService.js

export const subscriptionService = {
  // ---------- Dashboard (plan counts) ----------
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

  // ---------- List plans (optionally filter by type) ----------
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

  // ---------- Get a single plan by id ----------
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

  // ---------- Get plans for the authenticated user ----------
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

  // ---------- Create ----------
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

  // ---------- Update ----------
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

  // ---------- Purchased subscriptions (history) ----------
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
// -----------------reports services api------------------

export const reportService = {
  getKpiDashboard: async () => {
    const response = await apiClient.get(ENDPOINTS.ADMIN.REPORTS.KPI_DASHBOARD);
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load KPI dashboard');
    }
    return payload?.data || null;
  },

  // ✅ NEW: Active clients
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

  // ✅ NEW: Inactive clients
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
  // ✅ NEW: Subscription Sales Report
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
// ✅ NEW: Latest transactions
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

// ✅ NEW: Transaction graph
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
// ✅ NEW: Support tickets for reports
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
// ✅ NEW: City-wise usage
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
// -----------language-------------------
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
 * ✅ NEW: Audit Services
 */
export const auditService = {
  // Dashboard overview (stats)
  getOverview: async () => {
    const response = await apiClient.get(ENDPOINTS.ADMIN.AUDITS.OVERVIEW);
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load audit overview');
    }
    return payload?.data || null;
  },

  // Activity report (paginated)
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

  // Get single audit log
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

  // Export summary (for CSV/PDF)
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
 * ✅ NEW: POS Hardware Services
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
 * ✅ NEW: Support Ticket Services
 */
/**
 * ✅ Support Ticket Services
 */
export const supportTicketService = {
  // GET
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

  // GET
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

  // ✅ PUT (was POST)
  updateTicketStatus: async (id, status) => {
    const response = await apiClient.put(
      ENDPOINTS.ADMIN.SUPPORT_TICKETS.UPDATE,
      { id, Ticket_status: status }
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to update ticket');
    }
    return payload?.data || null;
  },

  // POST (create reply — creating a new resource)
  createReply: async ({
    support_ticket_id,
    reply,
    employee_id,
    Ticket_status,
    Status = true,
  }) => {
    const response = await apiClient.post(
      ENDPOINTS.ADMIN.SUPPORT_TICKETS.REPLY,
      {
        support_ticket_id,
        reply,
        employee_id,
        Ticket_status,
        Status,
      }
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to submit reply');
    }
    return payload?.data || null;
  },

  // GET
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
 * ✅ NEW: Hardware Asset Management Services
 */
export const hamService = {
  // Get all devices in the master inventory
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

  // Get devices that were sold & assigned to restaurants
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

  // Inventory status (aggregate counts)
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

  // Create a new device
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
 * ✅ MDM Device Management Services
 */
export const mdmService = {
  // Get all devices
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

  // Get devices for the authenticated user
  getMyDevicesByAuth: async () => {
    const response = await apiClient.get(ENDPOINTS.ADMIN.MDM.GET_BY_AUTH);
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load devices');
    }
    return payload?.data || [];
  },

  // Session logs
  getSessionLogs: async (id) => {
    const response = await apiClient.get(
      ENDPOINTS.ADMIN.MDM.SESSION_LOGS(id)
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load session logs');
    }
    // Response can be either { data: [...] } or { device, logs }
    if (Array.isArray(payload?.data)) return { logs: payload.data };
    return payload?.data || { logs: [] };
  },

  // ✅ Lock device
  lockDevice: async (id, reason) => {
    const response = await apiClient.post(
      ENDPOINTS.ADMIN.MDM.LOCK(id),
      { reason }
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to lock device');
    }
    return payload?.data || null;
  },

  // ✅ Restart device
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

  // ✅ Push app update
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

  // ✅ Wipe device — step 1: initiate with credentials
  wipeDevice: async (id, { email, password }) => {
    const response = await apiClient.post(
      ENDPOINTS.ADMIN.MDM.WIPE(id),
      { Email: email, password }
    );
    const data = response.data;
    if (data?.success === false) {
      throw new Error(data?.message || 'Failed to initiate wipe');
    }
    return data?.data || null;
  },

  // ✅ Wipe device — step 2: verify with OTP
  verifyWipeDevice: async (id, { otp, mode }) => {
    const response = await apiClient.post(
      ENDPOINTS.ADMIN.MDM.WIPE_VERIFY(id),
      { OTP: otp, Wipe_Mode: mode }
    );
    const data = response.data;
    if (data?.success === false) {
      throw new Error(data?.message || 'Failed to verify wipe');
    }
    return data?.data || null;
  },
};
// src/Services/apiService.js

/**
 * ✅ NEW: SubAdmin Services
 */
export const subadminService = {
  // List with pagination + filters
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

  // Current authenticated user's profile
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

  // src/Services/apiService.js

update: async (id, payload) => {
  // ✅ Exactly matching Postman: PUT /admin/subadmin/update/{id}
  const url = ENDPOINTS.ADMIN.SUBADMIN.UPDATE(id);
  console.log('🔄 PUT', url);
  console.log('🔄 Payload:', JSON.stringify(payload, null, 2));

  const response = await apiClient.put(url, payload);

  console.log('✅ Response:', response.data);

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
  // Delete
  remove: async (id) => {
    const response = await apiClient.delete(
      ENDPOINTS.ADMIN.SUBADMIN.DELETE(id)
    );
    const data = response.data;
    if (data?.success === false) {
      throw new Error(data?.message || 'Failed to delete subadmin');
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

  // ✅ FIXED: PATCH instead of PUT
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
// src/Services/apiService.js

/**
 * ✅ NEW: Account Settings Services
 */
export const accountSettingsService = {
  // Get date/time settings
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

  // ✅ POST — update
  updateDateTime: async (payload) => {
    const response = await apiClient.post(   // ← POST, not PUT
      ENDPOINTS.ADMIN.ACCOUNT_SETTINGS.DATE_TIME,
      payload
    );
    const data = response.data;
    if (data?.success === false) {
      throw new Error(data?.message || 'Failed to update date/time');
    }
    return data?.data || null;
  },

  // Get current logged-in user profile
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
};

/**
 * ✅ NEW: Currency Services
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