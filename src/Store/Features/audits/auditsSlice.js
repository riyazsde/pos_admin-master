// src/Features/audits/auditsSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Overview stats
  overview: {
    totalAudits: 0,
    todayAudits: 0,
    auditsByEnvironment: [],
    auditsByAction: [],
    auditTrend: [],
    lastUpdated: null,
  },

  // Activity list
  activity: [],
  activityPagination: null,

  // Loading flags
  overviewLoading: false,
  activityLoading: false,
  exportLoading: false,

  // Error
  error: null,
  hasLoaded: false,
};

const auditsSlice = createSlice({
  name: 'audits',
  initialState,
  reducers: {
    // Overview
    setOverviewLoading: (state, action) => {
      state.overviewLoading = action.payload;
    },
    setOverviewData: (state, action) => {
      state.overview = { ...state.overview, ...(action.payload || {}) };
      state.overviewLoading = false;
      state.hasLoaded = true;
      state.error = null;
    },

    // Activity
    setActivityLoading: (state, action) => {
      state.activityLoading = action.payload;
    },
    setActivityData: (state, action) => {
      state.activity = action.payload?.data || [];
      state.activityPagination = action.payload?.pagination || null;
      state.activityLoading = false;
    },

    // Export
    setExportLoading: (state, action) => {
      state.exportLoading = action.payload;
    },

    // Error
    setAuditsError: (state, action) => {
      state.error = action.payload;
      state.overviewLoading = false;
      state.activityLoading = false;
      state.exportLoading = false;
    },

    resetAudits: () => initialState,
  },
});

export const {
  setOverviewLoading,
  setOverviewData,
  setActivityLoading,
  setActivityData,
  setExportLoading,
  setAuditsError,
  resetAudits,
} = auditsSlice.actions;

export default auditsSlice.reducer;