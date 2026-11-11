// src/Services/apiService.js
import apiClient from './apiClient';
import { ENDPOINTS } from './endpoints';
import { clearAuth } from '../utils/authStorage';
import { store } from '../Store/store';
import { loginSuccess, logoutSuccess } from '../Store/Features/auth/authSlice';
import { getToken } from '../utils/authStorage';

/* ------------------------------------------------------------------ */
/*  NORMALIZER HELPERS                                                 */
/* ------------------------------------------------------------------ */
const safeArray = (v) => (Array.isArray(v) ? v : []);
const safeObj = (v) => (v && typeof v === 'object' ? v : {});
const num = (v) => Number(v) || 0;

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

const normalizeRestaurantPerformance = (payload) => {
  const d = safeObj(payload?.data || payload);
  const chartSource =
    d.Chart || d.chart || d.ChartData || d.chartData || d.data || [];
  return {
    summary: {
      totalSales: num(d.TotalSalesCount),
      totalOrders: num(d.TotalOrdersCount),
      totalActiveClients: num(d.TotalActiveClientsCount),
      newCustomers: num(d.NewCustomersCount),
      repeatCustomers: num(d.RepeatCustomersCount),
      avgOrderValue: num(d.AvgOrderValueCount),
    },
    chart: safeArray(chartSource).map((p) => ({
      time: p.time ?? p.Time ?? p.label ?? p.Label ?? '',
      value: num(p.value ?? p.Value ?? p.sales ?? p.Sales ?? 0),
    })),
  };
};

const normalizeRenewal = (payload) => {
  const d = safeObj(payload?.data || payload);

  // CurrentPlan is an object in the API — extract the plan name only
  const planObj = safeObj(d.CurrentPlan);
  const planName = planObj.PlanName || d.Plan || '—';
  const planDescription = planObj.Description || '—';
  const planType = planObj.Subscription_Type || '—';
  const planPrice = planObj.Price ?? null;

  return {
    // Plan
    currentPlan: planName,
    planName,
    planDescription,
    planType,
    planPrice,

    // Dates
    purchasedDate: d.PurchaseDate ?? null,
    renewalDate: d.RenewalDate ?? null,
    firstPurchaseOn: d.FirstPurchaseOn ?? null,
    daysUntilRenewal: Number(d.DaysUntilRenewal ?? 0),

    // Subscription meta
    noOfRenewals: Number(d.NoOfRenewals ?? 0),
    subscriptionId: d.SubscriptionId ?? null,
    subscriptionCount: Number(d.SubscriptionCount ?? 0),
    renewalStatus: d.RenewalStatus ?? '—',
    hasSubscription: Boolean(d.HasSubscription),
    isActive: Boolean(d.IsActive),
    isDemo: Boolean(d.IsDemo),
    autoRenew: Boolean(d.AutoRenew),
    ownerAccountLinked: Boolean(d.OwnerAccountLinked),
    canSendRenewalMessage:
      d.CanSendRenewalMessage !== undefined
        ? Boolean(d.CanSendRenewalMessage)
        : true,

    // Billing
    paymentMethod: d.PaymentMethod || '—',
    paymentStatus: d.PaymentStatus || '—',
    currency: d.Currency || 'XOF',

    // Owner / client
    clientsId: d.Clients_id ?? null,
    ownerUserId: d.Owner_User_id ?? null,

    // Message (API doesn't return one; keep default text handled in UI)
    renewalMessage: d.Renewal_Message ?? d.RenewalMessage ?? '',

    // Toggles — API doesn't currently expose these; keep local defaults
    notifyTwoWeeksAgo: d.Two_Weeks_Ago ?? d.NotifyTwoWeeksAgo ?? true,
    notifyOneWeekAgo: d.One_Week_Ago ?? d.NotifyOneWeekAgo ?? true,
    notifyOneDayAgo: d.One_Day_Ago ?? d.NotifyOneDayAgo ?? true,

    raw: d,
  };
};

/* ---------------- Employees ---------------- */
const normalizeEmployee = (e) => {
  const src = safeObj(e);
  const status =
    src.Status ?? src.status ?? src.isActive ?? src.IsActive ?? null;
  const isActive =
    status === true ||
    status === 1 ||
    status === 'true' ||
    status === 'Active' ||
    status === 'active';

  return {
    userId: src.user_id ?? src.User_id ?? src._id ?? src.id ?? null,
    name:
      src.Name ||
      src.name ||
      src.Employee_Name ||
      `${src.FirstName || ''} ${src.LastName || ''}`.trim() ||
      '—',
    email: src.email || src.Email || '—',
    phone: src.Phone || src.phone || src.Mobile || '—',
    role:
      src.Role ||
      src.role ||
      src.Designation ||
      src.Role_Name ||
      'Unassigned',
    image:
      src.Image || src.image || src.profile_image || src.Profile_Image || null,
    status,
    isActive,
    timing:
      src.Timing ||
      src.timing ||
      src.Shift ||
      src.Working_Hours ||
      src.Timing_Details ||
      null,
    performance: {
      orders: Number(
        src.TotalOrders ?? src.Orders ?? src.orders ?? src.Order_Count ?? 0
      ),
      revenue: Number(
        src.TotalRevenue ?? src.Revenue ?? src.revenue ?? src.Sales ?? 0
      ),
      rating: src.Rating ?? src.rating ?? null,
    },
    raw: src,
  };
};

const normalizeEmployeeList = (payload) => {
  const root = safeObj(payload);
  const data = safeObj(root.data || root);

  // Find the actual array in any of the possible keys
  const possibleArrays = [
    data.employees,
    data.Employees,
    data.employee,
    data.employeeList,
    data.EmployeesList,
    data.data,
    root.data,
    root.employees,
  ];
  const rawList =
    possibleArrays.find((a) => Array.isArray(a)) ||
    (Array.isArray(root.data) ? root.data : []);

  const employees = safeArray(rawList).map(normalizeEmployee);

  // Role counts — support both object and array shapes
  const roleCountsSource =
    data.roleCounts ||
    data.RoleCounts ||
    data.EmployeeCountByRole ||
    data.employeeCountByRole ||
    root.roleCounts ||
    [];

  let roleCounts = [];
  if (Array.isArray(roleCountsSource)) {
    roleCounts = roleCountsSource.map((r) => ({
      role: r.role || r.Role || r.name || r.Name || '—',
      count: Number(r.count || r.Count || r.total || 0),
    }));
  } else if (roleCountsSource && typeof roleCountsSource === 'object') {
    roleCounts = Object.entries(roleCountsSource).map(([role, count]) => ({
      role,
      count: Number(count) || 0,
    }));
  }

  // If no roleCounts provided, derive from employees
  if (roleCounts.length === 0 && employees.length > 0) {
    const map = employees.reduce((acc, emp) => {
      const key = emp.role || 'Unassigned';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    roleCounts = Object.entries(map).map(([role, count]) => ({
      role,
      count,
    }));
  }

  // Group by role
  const grouped = employees.reduce((acc, emp) => {
    const key = emp.role || 'Unassigned';
    if (!acc[key]) acc[key] = [];
    acc[key].push(emp);
    return acc;
  }, {});

  const total =
    data.total ??
    data.Total ??
    data.TotalEmployees ??
    root.total ??
    root.count ??
    employees.length;

  return {
    employees,
    grouped,
    roleCounts,
    total: Number(total) || employees.length,
    raw: data,
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
    const response = await apiClient.post(ENDPOINTS.AUTH.CHANGE_PASSWORD, {
      currentPassword,
      newPassword,
      reEnterPassword,
    });
    return response.data;
  },
};

/* ------------------------------------------------------------------ */
/*  ADMIN DASHBOARD                                                    */
/* ------------------------------------------------------------------ */
export const dashboardService = {
  getMainDashboard: async (filter, signal) => {
    const response = await apiClient.get(ENDPOINTS.ADMIN.DASHBOARD.MAIN, {
      params: filter ? { filter } : undefined,
      signal,
    });
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load dashboard');
    }
    return payload?.data || null;
  },

  getProfitAfterTax: async (filter) => {
    const response = await apiClient.get(
      ENDPOINTS.ADMIN.DASHBOARD.PROFIT_AFTER_TAX,
      { params: filter ? { filter } : undefined }
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load profit data');
    }
    return payload?.data || null;
  },

  getTopPerformers: async (page = 1, limit = 10, filter) => {
    const response = await apiClient.get(
      ENDPOINTS.ADMIN.DASHBOARD.TOP_PERFORMERS,
      { params: { page, limit, ...(filter ? { filter } : {}) } }
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

  getSubscriptions: async (page = 1, limit = 10, filter) => {
    const response = await apiClient.get(
      ENDPOINTS.ADMIN.DASHBOARD.SUBSCRIPTIONS,
      { params: { page, limit, ...(filter ? { filter } : {}) } }
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

  getHeatmap: async (filter) => {
    const response = await apiClient.get(ENDPOINTS.ADMIN.DASHBOARD.HEATMAP, {
      params: filter ? { filter } : undefined,
    });
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load heatmap');
    }
    return payload?.data || null;
  },

  getSupportTickets: async (page = 1, limit = 5, status = 'Open', filter) => {
    const response = await apiClient.get(
      ENDPOINTS.ADMIN.DASHBOARD.SUPPORT_TICKETS,
      { params: { page, limit, status, ...(filter ? { filter } : {}) } }
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

  getRenewalAlerts: async (page = 1, limit = 10, filter) => {
    const response = await apiClient.get(
      ENDPOINTS.ADMIN.DASHBOARD.RENEWAL_ALERTS,
      { params: { page, limit, ...(filter ? { filter } : {}) } }
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

  getCompleteDashboard: async (filter) => {
    const response = await apiClient.get(ENDPOINTS.ADMIN.DASHBOARD.COMPLETE, {
      params: filter ? { filter } : undefined,
    });
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
export const searchService = {
  search: async (q, limit = 5, signal) => {
    const response = await apiClient.get(ENDPOINTS.ADMIN.SEARCH, {
      params: { q, limit },
      signal,
    });
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to search admin records');
    }

    const containers = [
      payload?.results,
      payload?.data?.results,
      payload?.data?.items,
      payload?.data?.result,
      payload?.data?.data,
      payload?.data,
      payload,
    ];
    const resultList = containers.find(Array.isArray);
    if (resultList) return resultList;

    const groupedResults = containers.find(
      (value) => value && typeof value === 'object' && !Array.isArray(value)
    );
    if (groupedResults) {
      return Object.entries(groupedResults).flatMap(([type, group]) => {
        const groupResults = Array.isArray(group)
          ? group
          : Array.isArray(group?.results)
            ? group.results
            : null;
        return groupResults
          ? groupResults.map((item) =>
              item && typeof item === 'object' && !Array.isArray(item)
                ? {
                    ...item,
                    type: item.type || item.entity || item.category || type,
                  }
                : item
            )
          : [];
      });
    }

    throw new Error('Search response did not contain a results list');
  },
};

export const clientService = {
  createClient: async (payload) => {
    const response = await apiClient.post(
      ENDPOINTS.ADMIN.CLIENTS.CREATE,
      payload
    );
    const data = response.data;
    if (data?.success === false) {
      throw new Error(data?.message || 'Failed to create client');
    }
    return data?.data || null;
  },

  getAllClients: async (filter = 'all') => {
    const response = await apiClient.get(ENDPOINTS.ADMIN.CLIENTS.GET_ALL, {
      params: { filter },
    });
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load clients');
    }
    return {
      data: payload?.data || [],
      count: payload?.count ?? (payload?.data?.length || 0),
      summary: payload?.summary ?? null,
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

  getClientRenewal: async (id) => {
    const response = await apiClient.get(
      ENDPOINTS.ADMIN.CLIENTS.GET_RENEWAL(id)
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load renewal data');
    }
    return normalizeRenewal(payload?.data ?? payload);
  },

  sendRenewalMessage: async (id) => {
    const response = await apiClient.post(
      ENDPOINTS.ADMIN.CLIENTS.SEND_RENEWAL_MESSAGE(id)
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to send renewal message');
    }
    return payload?.data || null;
  },

  resetPassword: async (id, { newPassword, confirmPassword }) => {
    const response = await apiClient.patch(
      ENDPOINTS.ADMIN.CLIENTS.RESET_PASSWORD(id),
      { newPassword, confirmPassword }
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to reset password');
    }
    return payload?.data || null;
  },
};

/* ------------------------------------------------------------------ */
/*  EMPLOYEES                                                          */
/* ------------------------------------------------------------------ */
export const employeeService = {
  getByClient: async (clientId) => {
    const response = await apiClient.get(
      ENDPOINTS.ADMIN.USER.EMPLOYEES_BY_CLIENT(clientId)
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load employees');
    }
    return normalizeEmployeeList(payload);
  },

  getByRestaurant: async (restaurantUserId) => {
    const response = await apiClient.get(
      ENDPOINTS.ADMIN.USER.EMPLOYEES_BY_RESTAURANT(restaurantUserId)
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load employees');
    }
    return normalizeEmployeeList(payload);
  },

  getById: async (employeeUserId) => {
    const response = await apiClient.get(
      ENDPOINTS.ADMIN.USER.EMPLOYEE_DETAILS_BY_ID(employeeUserId)
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Employee not found');
    }
    const data = safeObj(payload?.data || payload);
    return { ...normalizeEmployee(data), raw: data };
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
      throw new Error(
        payload?.message || 'Failed to load subscription dashboard'
      );
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
    const data = Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload?.data?.data)
        ? payload.data.data
        : [];
    return { data, count: payload?.count ?? payload?.data?.count ?? data.length };
  },

  getPublicPlans: async (subscriptionType) => {
    const response = await apiClient.get(
      ENDPOINTS.ADMIN.SUBSCRIPTION.GET_PUBLIC,
      { params: { Subscription_Type: subscriptionType } }
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load public plans');
    }
    const data = Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload?.data?.data)
        ? payload.data.data
        : [];
    return { data, count: payload?.count ?? payload?.data?.count ?? data.length };
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
    const data = Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload?.data?.data)
        ? payload.data.data
        : [];
    return { data, count: payload?.count ?? payload?.data?.count ?? data.length };
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

  deletePlan: async (id) => {
    const response = await apiClient.delete(
      ENDPOINTS.ADMIN.SUBSCRIPTION.DELETE(id)
    );
    const data = response.data;
    if (data?.success === false) {
      throw new Error(data?.message || 'Failed to delete plan');
    }
    return data?.data || null;
  },

  getSubscriptionHistory: async (page = 1, limit = 10, status = 'all') => {
    const response = await apiClient.get(ENDPOINTS.ADMIN.SUBSCRIPTION.HISTORY, {
      params: { page, limit, status },
    });
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(
        payload?.message || 'Failed to load subscription history'
      );
    }
    return {
      data: payload?.data || [],
      pagination: payload?.pagination || null,
    };
  },
};

/* ------------------------------------------------------------------ */
/*  REPORTS                                                            */
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
    filter,
  } = {}) => {
    const response = await apiClient.get(
      ENDPOINTS.ADMIN.REPORTS.LOW_STOCK_ALERTS,
      { params: { threshold, location, search, ...(filter ? { filter } : {}) } }
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
      throw new Error(
        payload?.message || 'Failed to load subscription report'
      );
    }
    return normalizeSubscriptions(payload);
  },

  getRestaurantDashboard: async () => {
    const response = await apiClient.get(
      ENDPOINTS.ADMIN.REPORTS.RESTAURANT_DASHBOARD
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(
        payload?.message || 'Failed to load restaurant dashboard'
      );
    }
    return payload?.data || null;
  },

  getRestaurantPerformance: async ({ restaurantId, filter = '24H' } = {}) => {
    const response = await apiClient.get(
      ENDPOINTS.ADMIN.REPORTS.RESTAURANT_PERFORMANCE,
      { params: { restaurant_id: restaurantId, filter } }
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(
        payload?.message || 'Failed to load restaurant performance'
      );
    }
    return normalizeRestaurantPerformance(payload);
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
      throw new Error(
        payload?.message || 'Failed to load hardware sales report'
      );
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

    const response = await apiClient.get(ENDPOINTS.ADMIN.AUDITS.ACTIVITY, {
      params,
    });
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
    const response = await apiClient.get(ENDPOINTS.ADMIN.AUDITS.GET_BY_ID(id));
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
      throw new Error(
        payload?.message || 'Failed to load POS hardware dashboard'
      );
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

    const response = await apiClient.get(ENDPOINTS.ADMIN.SUPPORT_TICKETS.LIST, {
      params,
    });
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load tickets');
    }
    return {
      data: payload?.data || [],
      pagination: payload?.pagination || null,
    };
  },

  getAssignableUsers: async () => {
    const response = await apiClient.get(
      ENDPOINTS.ADMIN.SUPPORT_TICKETS.ASSIGNABLE_USERS
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load assignable users');
    }
    return payload?.data || [];
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
    const response = await apiClient.post(ENDPOINTS.ADMIN.SUPPORT_TICKETS.REPLY, {
      support_ticket_id,
      reply,
      employee_id,
      Ticket_status,
      Status,
    });
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to submit reply');
    }
    return payload?.data || null;
  },

  getChart: async (filter = '1Month') => {
    const response = await apiClient.get(ENDPOINTS.ADMIN.SUPPORT_TICKETS.CHART, {
      params: { filter },
    });
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load chart');
    }
    return payload?.data || null;
  },
};

/* ------------------------------------------------------------------ */
/*  HAM                                                                */
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

  getSoldInRestaurant: async (filter) => {
    const response = await apiClient.get(
      ENDPOINTS.ADMIN.HAM.SOLD_IN_RESTAURANT,
      { params: filter ? { filter } : undefined }
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
      ENDPOINTS.ADMIN.POS_HARDWARE.INVENTORY_STATUS
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
    const response = await apiClient.get(ENDPOINTS.ADMIN.MDM.SESSION_LOGS(id));
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

  unlockDevice: async (id, reason) => {
    const response = await apiClient.post(ENDPOINTS.ADMIN.MDM.UNLOCK(id), {
      reason,
    });
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to unlock device');
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

    const response = await apiClient.get(ENDPOINTS.ADMIN.SUBADMIN.GET_ALL, {
      params,
    });
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
    const response = await apiClient.get(ENDPOINTS.ADMIN.SUBADMIN.GET_BY_AUTH);
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to load profile');
    }
    return payload?.data || null;
  },

  update: async (id, payload) => {
    const response = await apiClient.put(
      ENDPOINTS.ADMIN.SUBADMIN.UPDATE(id),
      payload
    );
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
    const response = await apiClient.put(
      ENDPOINTS.ADMIN.ACCOUNT_SETTINGS.DATE_TIME,
      payload
    );
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

  createApiKey: async ({
    name,
    environment = 'Production',
    permissions = ['read'],
  }) => {
    const response = await apiClient.post(
      ENDPOINTS.ADMIN.ACCOUNT_SETTINGS.API_KEYS,
      { name, environment, permissions }
    );
    const payload = response.data;
    if (payload?.success === false) {
      throw new Error(payload?.message || 'Failed to create API key');
    }
    return { data: payload?.data || null, warning: payload?.warning || null };
  },

  revokeApiKey: async (keyId) => {
    const response = await apiClient.post(
      ENDPOINTS.ADMIN.ACCOUNT_SETTINGS.REVOKE_API_KEY(keyId),
      {}
    );
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
    const response = await apiClient.post(
      ENDPOINTS.ADMIN.ACCOUNT_SETTINGS.TRUSTED_DEVICES,
      { name: device_name, type: device_type }
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
    const all = payload?.data || [];
    const visible = all.filter((item) => !item.isDeleted);
    return { data: visible, count: visible.length };
  },

  create: async ({ option, details, Status, status }) => {
    const finalStatus = Status ?? status ?? true;
    const response = await apiClient.post(
      ENDPOINTS.ADMIN.PAYMENT_OPTIONS.CREATE,
      {
        PaymentOption: [{ option, Details: details }],
        Status: finalStatus,
      }
    );
    const data = response.data;
    if (data?.success === false) {
      throw new Error(data?.message || 'Failed to create payment option');
    }
    return data?.data || null;
  },

  update: async (id, { option, details, Status, status }) => {
    const finalStatus = Status ?? status ?? true;
    const body = { Status: finalStatus };
    if (option !== undefined || details !== undefined) {
      body.PaymentOption = [{ option, Details: details }];
    }
    const response = await apiClient.put(
      ENDPOINTS.ADMIN.PAYMENT_OPTIONS.UPDATE(id),
      body
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