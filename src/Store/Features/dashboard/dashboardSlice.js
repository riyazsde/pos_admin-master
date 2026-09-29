// src/Features/dashboard/dashboardSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  kpis: {
    totalRevenue: 0,
    monthlySecurity: 0,
    totalPOSClients: 0,
  },
  dailyActivity: {
    title: '',
    subtitle: '',
    data: [],
  },
  monthlyGrowth: {
    title: '',
    subtitle: '',
    data: [],
  },
  lastUpdated: null,
  loading: false,
  error: null,
  hasLoaded: false,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
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
    resetDashboard: () => initialState,
  },
});

export const {
  setDashboardLoading,
  setDashboardData,
  setDashboardError,
  resetDashboard,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;