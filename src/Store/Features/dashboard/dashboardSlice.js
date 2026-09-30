import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Existing
  kpis: { totalRevenue: 0, monthlySecurity: 0, totalPOSClients: 0 },
  dailyActivity: { title: '', subtitle: '', data: [] },
  monthlyGrowth: { title: '', subtitle: '', data: [] },
  lastUpdated: null,

  // Profit After Tax
  profit: null,
  profitLoading: false,

  // Top Performers
  topPerformers: [],
  topPerformersPagination: null,
  topPerformersLoading: false,
  subscriptions: [],
  subscriptionsPagination: null,
  subscriptionsLoading: false,

  heatmap: null,
  heatmapLoading: false,
  supportTickets: [],
  supportTicketsPagination: null,
  supportTicketsLoading: false,

  renewalAlerts: [],
  renewalAlertsPagination: null,
  renewalAlertsLoading: false,
  subscriptions: [],
subscriptionsLoading: false,

heatmap: null,
heatmapLoading: false,

supportTickets: [],
supportTicketsLoading: false,

renewalAlerts: [],
renewalAlertsLoading: false,

completeDashboardLoading: false,
completeDashboardLoaded: false,
completeDashboardError: null,
  // Existing
  loading: false,
  error: null,
  hasLoaded: false,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    // Existing
    setDashboardLoading: (state, action) => {
      state.loading = action.payload;
    },
    setDashboardData: (state, action) => {
      const { kpis, dailyActivity, monthlyGrowth, lastUpdated } = action.payload || {};
      if (kpis) state.kpis = kpis;
      if (dailyActivity) state.dailyActivity = dailyActivity;
      if (monthlyGrowth) state.monthlyGrowth = monthlyGrowth;
      state.lastUpdated = lastUpdated || null;
      state.hasLoaded = true;
      state.error = null;
    },
    setDashboardError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    //  Profit
    setProfitData: (state, action) => {
      state.profit = action.payload;
      state.profitLoading = false;
    },
    setProfitLoading: (state, action) => {
      state.profitLoading = action.payload;
    },

    //  Top Performers
    setTopPerformersData: (state, action) => {
      state.topPerformers = action.payload.data || [];
      state.topPerformersPagination = action.payload.pagination || null;
      state.topPerformersLoading = false;
    },
    setTopPerformersLoading: (state, action) => {
      state.topPerformersLoading = action.payload;
    },
    setSubscriptionsData: (state, action) => {
      state.subscriptions = action.payload.data || [];
      state.subscriptionsPagination = action.payload.pagination || null;
      state.subscriptionsLoading = false;
    },
    setSubscriptionsLoading: (state, action) => {
      state.subscriptionsLoading = action.payload;
    },

    setHeatmapData: (state, action) => {
      state.heatmap = action.payload;
      state.heatmapLoading = false;
    },
    setHeatmapLoading: (state, action) => {
      state.heatmapLoading = action.payload;
    },

    setSupportTicketsData: (state, action) => {
      state.supportTickets = action.payload.data || [];
      state.supportTicketsPagination = action.payload.pagination || null;
      state.supportTicketsLoading = false;
    },
    setSupportTicketsLoading: (state, action) => {
      state.supportTicketsLoading = action.payload;
    },

    setRenewalAlertsData: (state, action) => {
      state.renewalAlerts = action.payload.data || [];
      state.renewalAlertsPagination = action.payload.pagination || null;
      state.renewalAlertsLoading = false;
    },
    setRenewalAlertsLoading: (state, action) => {
      state.renewalAlertsLoading = action.payload;
    },
    setCompleteDashboardData: (state, action) => {
  const { subscriptionsPurchased, heatMap, supportTickets, renewalAlerts } =
    action.payload || {};

  state.subscriptions = subscriptionsPurchased || [];
  state.heatmap = heatMap || null;
  state.supportTickets = supportTickets?.data || [];
  state.renewalAlerts = renewalAlerts?.data || [];

  state.subscriptionsLoading = false;
  state.heatmapLoading = false;
  state.supportTicketsLoading = false;
  state.renewalAlertsLoading = false;

  state.completeDashboardLoaded = true;
  state.completeDashboardLoading = false;
  state.completeDashboardError = null;
},
setCompleteDashboardLoading: (state, action) => {
  state.completeDashboardLoading = action.payload;
},
setCompleteDashboardError: (state, action) => {
  state.completeDashboardError = action.payload;
  state.completeDashboardLoading = false;
},

    resetDashboard: () => initialState,
  },
});

export const {
  setDashboardLoading,
  setDashboardData,
  setDashboardError,
  setProfitData,
  setProfitLoading,
  setTopPerformersData,
  setTopPerformersLoading,
  resetDashboard,
  setSubscriptionsData,
  setSubscriptionsLoading,
  setHeatmapData,
  setHeatmapLoading,
  setSupportTicketsData,
  setSupportTicketsLoading,
  setRenewalAlertsData,
  setRenewalAlertsLoading,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;