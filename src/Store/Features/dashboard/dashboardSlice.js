// src/Store/Features/dashboard/dashboardSlice.js

import { createSlice } from '@reduxjs/toolkit';

// ---------------------------------------------------------------------------
// Initial State
// ---------------------------------------------------------------------------
const initialState = {
  // ---- Main dashboard ----
  kpis: { totalRevenue: 0, monthlySecurity: 0, totalPOSClients: 0 },
  dailyActivity: { title: '', subtitle: '', data: [] },
  monthlyGrowth: { title: '', subtitle: '', data: [] },
  lastUpdated: null,
  loading: false,
  error: null,
  hasLoaded: false,

  // ---- Profit After Tax ----
  profit: null,
  profitLoading: false,

  // ---- Top Performers ----
  topPerformers: [],
  topPerformersPagination: null,
  topPerformersLoading: false,

  // ---- Subscriptions ----
  subscriptions: [],
  subscriptionsPagination: null,
  subscriptionsLoading: false,

  // ---- Heatmap ----
  heatmap: null,
  heatmapLoading: false,

  // ---- Support Tickets ----
  supportTickets: [],
  supportTicketsPagination: null,
  supportTicketsLoading: false,

  // ---- Renewal Alerts ----
  renewalAlerts: [],
  renewalAlertsPagination: null,
  renewalAlertsLoading: false,

  // ---- Complete Dashboard ----
  completeDashboardLoading: false,
  completeDashboardLoaded: false,
  completeDashboardError: null,
};

// ---------------------------------------------------------------------------
// Slice
// ---------------------------------------------------------------------------
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    // ---------------- MAIN ----------------
    setDashboardLoading: (state, action) => {
      state.loading = action.payload;
    },
    setDashboardData: (state, action) => {
      const { kpis, dailyActivity, monthlyGrowth, lastUpdated } =
        action.payload || {};
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

    // ---------------- PROFIT ----------------
    setProfitData: (state, action) => {
      state.profit = action.payload;
      state.profitLoading = false;
    },
    setProfitLoading: (state, action) => {
      state.profitLoading = action.payload;
    },

    // ---------------- TOP PERFORMERS ----------------
    setTopPerformersData: (state, action) => {
      state.topPerformers = action.payload?.data || [];
      state.topPerformersPagination = action.payload?.pagination || null;
      state.topPerformersLoading = false;
    },
    setTopPerformersLoading: (state, action) => {
      state.topPerformersLoading = action.payload;
    },

    // ---------------- SUBSCRIPTIONS ----------------
    setSubscriptionsData: (state, action) => {
      state.subscriptions = action.payload?.data || [];
      state.subscriptionsPagination = action.payload?.pagination || null;
      state.subscriptionsLoading = false;
    },
    setSubscriptionsLoading: (state, action) => {
      state.subscriptionsLoading = action.payload;
    },

    // ---------------- HEATMAP ----------------
    setHeatmapData: (state, action) => {
      state.heatmap = action.payload;
      state.heatmapLoading = false;
    },
    setHeatmapLoading: (state, action) => {
      state.heatmapLoading = action.payload;
    },

    // ---------------- SUPPORT TICKETS ----------------
    setSupportTicketsData: (state, action) => {
      state.supportTickets = action.payload?.data || [];
      state.supportTicketsPagination = action.payload?.pagination || null;
      state.supportTicketsLoading = false;
    },
    setSupportTicketsLoading: (state, action) => {
      state.supportTicketsLoading = action.payload;
    },

    // ---------------- RENEWAL ALERTS ----------------
    setRenewalAlertsData: (state, action) => {
      state.renewalAlerts = action.payload?.data || [];
      state.renewalAlertsPagination = action.payload?.pagination || null;
      state.renewalAlertsLoading = false;
    },
    setRenewalAlertsLoading: (state, action) => {
      state.renewalAlertsLoading = action.payload;
    },

    // ---------------- COMPLETE DASHBOARD ----------------
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

    // ---------------- RESET ----------------
    resetDashboard: () => initialState,
  },
});

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------
export const {
  // Main
  setDashboardLoading,
  setDashboardData,
  setDashboardError,

  // Profit
  setProfitData,
  setProfitLoading,

  // Top Performers
  setTopPerformersData,
  setTopPerformersLoading,

  // Subscriptions
  setSubscriptionsData,
  setSubscriptionsLoading,

  // Heatmap
  setHeatmapData,
  setHeatmapLoading,

  // Support Tickets
  setSupportTicketsData,
  setSupportTicketsLoading,

  // Renewal Alerts
  setRenewalAlertsData,
  setRenewalAlertsLoading,

  // Complete Dashboard — ✅ ADDED
  setCompleteDashboardData,
  setCompleteDashboardLoading,
  setCompleteDashboardError,

  // Reset
  resetDashboard,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;