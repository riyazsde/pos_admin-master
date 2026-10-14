// src/Services/apiService.js

import apiClient from './apiClient';
import { ENDPOINTS } from './endpoints';
import { clearAuth } from '../utils/authStorage';
import { store } from '../Store/store';
import { loginSuccess, logoutSuccess } from '../Store/Features/auth/authSlice';
import { getToken } from '../utils/authStorage';

/* ------------------------------------------------------------------ */
/*  NORMALIZER HELPERS (used by reportService)                         */
/* ------------------------------------------------------------------ */
const safeArray = (v) => (Array.isArray(v) ? v : []);
const safeObj = (v) => (v && typeof v === 'object' ? v : {});
const num = (v) => Number(v) || 0;

/* Revenue: Total_Revenue → totalRevenue, Location → location, etc. */
const normalizeRevenue = (payload) => {
  const s = safeObj(payload?.summary);
  return {
    data: safeArray(payload?.data).map((r) => ({
      clientId: r.Client_id,
      location: r.Location || 'N/A',
      city: r.City || 'N/A',
      revenue: num(r.Revenue),
      orders: num(r.Orders),
      avgOrder: num(r.Average_Order_Value),
      growth: r.Growth ?? null,
      isPositive:
        r.Growth != null
          ? typeof r.Growth === 'string'
            ? !r.Growth.trim().startsWith('-')
            : num(r.Growth) >= 0
          : null,
    })),
    summary: {
      totalRevenue: num(s.Total_Revenue),
      totalOrders: num(s.Total_Orders),
      averageOrderValue: num(s.Average_Order_Value),
      activeLocations: num(s.Active_Locations),
      revenueGrowth: num(s.Revenue_Growth),
    },
    pagination: payload?.pagination || null,
  };
};

/* Subscription: Subscriptions_By_Plan + Upcoming_Renewals at top level */
const normalizeSubscriptions = (payload) => {
  const s = safeObj(payload?.summary);
  return {
    data: safeArray(payload?.Subscriptions_By_Plan).map((p) => ({
      planId: p.Admin_Plan_id,
      planName: p.PlanName,
      subscriptionType: p.Subscription_Type,
      count: num(p.Subscriptions),
      activeCount: num(p.Active_Subscriptions),
      revenue: num(p.Total_Revenue),
      avgValue: num(p.Average_Value),
    })),
    summary: {
      mrr: num(s.Monthly_Recurring_Revenue),
      total: num(s.Total_Subscriptions),
      active: num(s.Active),
      inactive: num(s.Inactive),
      upcomingRenewals: safeArray(payload?.Upcoming_Renewals).map((u) => ({
        month: u.Month,
        count: num(u.Renewals_Expected),
        expectedRevenue: num(u.Expected_Revenue),
      })),
    },
  };
};

/* Low stock: Status/Device/Current/Minimum/Need_To_Order */
const normalizeLowStock = (payload) => {
  const s = safeObj(payload?.summary);
  return {
    data: safeArray(payload?.data).map((r) => ({
      itemId: r.Item_id,
      status: r.Status || 'Critical',
      device: r.Device,
      itemCode: r.Item_Code,
      location: r.Location ?? null,
      current: num(r.Current),
      minimum: num(r.Minimum),
      needToOrder: num(r.Need_To_Order),
    })),
    summary: {
      lowStockItems: num(s.Low_Stock_Items),
      criticalCount: num(s.Low_Stock_Items),
      threshold: num(s.Threshold),
    },
  };
};

/* Hardware sales: nested under data.summary + salesByHardwareCategory */
const normalizeHardwareSales = (payload) => {
  const d = safeObj(payload?.data);
  const s = safeObj(d.summary);
  return {
    data: safeArray(d.salesByHardwareCategory).map((c) => ({
      category: c.category,
      units: num(c.unitsSold),
      revenue: num(c.revenue),
      avgPrice: num(c.avgPrice),
    })),
    summary: {
      totalSales: num(s.totalHardwareSales),
      unitsSold: num(s.unitsSold),
      avgUnitPrice: num(s.averageUnitPrice),
      totalSaleRecords: num(s.totalSaleRecords),
      systemsSold: num(s.systemsSold),
      printersSold: num(s.printersSold),
    },
    dailyBreakdown: safeArray(d.dailyBreakdown).map((r) => ({
      date: r.Date,
      sales: num(r.Sales),
      unitsSold: num(r.UnitsSold),
      revenue: num(r.Revenue),
    })),
    topClients: safeArray(d.topClients).map((c) => ({
      userId: c.UserId,
      businessName: c.BusinessName,
      sales: num(c.Sales),
      unitsSold: num(c.UnitsSold),
      revenue: num(c.Revenue),
    })),
  };
};

/* Inventory: nested under data.summary + inventoryByLocation */
const normalizeInventory = (payload) => {
  const d = safeObj(payload?.data);
  const s = safeObj(d.summary);
  return {
    data: safeArray(d.inventoryByLocation).map((l) => ({
      location: l.location || 'Unassigned',
      device: l.devices || '—',
      total: num(l.totalItems),
      lowStock: num(l.lowStock),
      outOfStock: num(l.outOfStock),
      totalValue: num(l.totalValue),
    })),
    summary: {
      totalItems: num(s.totalInventoryItems),
      lowStock: num(s.lowStockItems),
      outOfStock: num(s.outOfStock),
      totalValue: num(s.totalValue),
      totalLocations: num(s.totalLocations),
    },
    inventory: safeObj(d.inventory),
    statusBreakdown: safeArray(d.statusBreakdown),
    topDevices: safeArray(d.topDevices).map((t) => ({
      deviceId: t.deviceId,
      name: t.name,
      type: t.type,
      location: t.location,
      stock: num(t.stock),
      unitPrice: num(t.unitPrice),
    })),
  };
};

/* ------------------------------------------------------------------ */
/*  AUTH                                                               */
/* ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------ */
/*  ADMIN DASHBOARD                                                    */
/* ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------ */
/*  CLIENT                                                             */
/* ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------ */
/*  SUBSCRIPTION                                                       */
/* ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------ */
/*  REPORTS                                                            */
/*  All analytics endpoints return camelCase shapes to the UI.        */
/* ------------------------------------------------------------------ */
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

  /* -------- Analytics (normalized) -------- */

  getRevenueReport: async ({
    dateRange = 'last30days',
    location = 'all',
    search = '',
  } = {}) => {
    const response = await apiClient.get(
      ENDPOINTS.ADMIN.REPORTS.REVENUE_REPORT,
      { params: { dateRange, location, search } }
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load revenue report');
    }
    return normalizeRevenue(payload);
  },

  getLowStockAlerts: async ({
    threshold = 10,
    location = 'all',
    search = '',
  } = {}) => {
    const response = await apiClient.get(
      ENDPOINTS.ADMIN.REPORTS.LOW_STOCK_ALERTS,
      { params: { threshold, location, search } }
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load low stock alerts');
    }
    return normalizeLowStock(payload);
  },

  getSubscriptionReport: async ({
    dateRange = 'last30days',
    location = 'all',
    search = '',
  } = {}) => {
    const response = await apiClient.get(
      ENDPOINTS.ADMIN.REPORTS.SUBSCRIPTION_REPORT,
      { params: { dateRange, location, search } }
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load subscription report');
    }
    return normalizeSubscriptions(payload);
  },

  getRestaurantDashboard: async () => {
    const response = await apiClient.get(
      ENDPOINTS.ADMIN.REPORTS.RESTAURANT_DASHBOARD
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load restaurant dashboard');
    }
    return payload?.data || null;
  },

  getInventoryStatus: async (params = {}) => {
    const response = await apiClient.get(
      ENDPOINTS.ADMIN.POS_HARDWARE.INVENTORY_STATUS,
      { params }
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load inventory status');
    }
    return normalizeInventory(payload);
  },

  getHardwareSalesReport: async ({ month, year, ...rest } = {}) => {
    const response = await apiClient.get(
      ENDPOINTS.ADMIN.POS_HARDWARE.SALES_REPORT,
      { params: { month, year, ...rest } }
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load hardware sales report');
    }
    return normalizeHardwareSales(payload);
  },
};

/* ------------------------------------------------------------------ */
/*  LANGUAGE                                                           */
/* ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------ */
/*  AUDIT                                                              */
/* ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------ */
/*  POS HARDWARE                                                       */
/* ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------ */
/*  SUPPORT TICKETS                                                    */
/* ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------ */
/*  HAM (Hardware Asset Mgmt)                                          */
/* ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------ */
/*  MDM                                                                */
/* ------------------------------------------------------------------ */
export const mdmService = {
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

  getMyDevicesByAuth: async () => {
    const response = await apiClient.get(ENDPOINTS.ADMIN.MDM.GET_BY_AUTH);
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load devices');
    }
    return payload?.data || [];
  },

  getSessionLogs: async (id) => {
    const response = await apiClient.get(
      ENDPOINTS.ADMIN.MDM.SESSION_LOGS(id)
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load session logs');
    }
    if (Array.isArray(payload?.data)) {
      return { device: null, logs: payload.data };
    }
    return {
      device: payload?.data?.device || null,
      logs: payload?.data?.logs || [],
    };
  },

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
      { responseType: 'blob' }
    );
    return response.data;
  },

  wipeDevice: async (id, { email, password }) => {
    const response = await apiClient.post(
      ENDPOINTS.ADMIN.MDM.WIPE_SEND_OTP(id),
      { Email: email, password }
    );
    const data = response.data;
    if (data?.success === false) {
      throw new Error(data?.message || 'Failed to send OTP');
    }
    return data?.data || null;
  },

  verifyWipeDevice: async (id, { otp, mode }) => {
    const response = await apiClient.post(ENDPOINTS.ADMIN.MDM.WIPE_VERIFY(id), {
      otp: String(otp).trim(),
      wipeMode: mode,
    });
    const data = response.data;
    if (data?.success === false) {
      throw new Error(data?.message || 'Failed to verify wipe');
    }
    return data?.data || null;
  },

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

/* ------------------------------------------------------------------ */
/*  SUBADMIN                                                           */
/* ------------------------------------------------------------------ */
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
      ENDPOINTS.ADMIN.PAYMENT_OPTIONS.DELETE(id)
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

/* ------------------------------------------------------------------ */
/*  ACCOUNT SETTINGS                                                   */
/* ------------------------------------------------------------------ */
export const accountSettingsService = {
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

    const response = await apiClient.put(url, payload);
    const data = response.data;

    if (data?.success === false) {
      throw new Error(data?.message || 'Failed to update date/time settings');
    }

    return data?.data || null;
  },

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

/* ------------------------------------------------------------------ */
/*  CURRENCY                                                           */
/* ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------ */
/*  PAYMENT OPTIONS                                                    */
/* ------------------------------------------------------------------ */
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