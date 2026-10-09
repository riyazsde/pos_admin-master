// src/Features/subscriptions/subscriptionsSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  plans: [],
  totalPlans: 0,
  activePlans: 0,
  planDetailsById: {},
  subscriptionHistory: [],
  subscriptionHistoryPagination: null,
  loading: false,
  creating: false,
  updating: false,
  historyLoading: false,
  error: null,
  hasLoaded: false,
};

const subscriptionsSlice = createSlice({
  name: 'subscriptions',
  initialState,
  reducers: {
    // ------ Plan catalog ------
    setSubscriptionsLoading: (state, action) => {
      state.loading = action.payload;
    },
    setSubscriptionsData: (state, action) => {
      const payload = action.payload || {};
      if (Array.isArray(payload.data)) {
        state.plans = payload.data;
        state.totalPlans = payload.count ?? payload.data.length;
        state.activePlans = payload.data.filter((p) => p.Status).length;
      }
      state.hasLoaded = true;
      state.loading = false;
      state.error = null;
    },
    setSubscriptionsError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // ------ Single plan ------
    setPlanDetail: (state, action) => {
      const plan = action.payload;
      if (plan?.Admin_Plan_id) {
        state.planDetailsById[plan.Admin_Plan_id] = plan;
      }
    },

    // ------ Add newly created plan (catalog only) ------
    addSubscriptionPlan: (state, action) => {
      const plan = action.payload;
      if (!plan) return;
      state.plans = [plan, ...state.plans];
      state.totalPlans += 1;
      if (plan.Status) state.activePlans += 1;
    },

    updateSubscriptionPlan: (state, action) => {
      const plan = action.payload;
      if (!plan) return;
      state.plans = state.plans.map((p) =>
        p.Admin_Plan_id === plan.Admin_Plan_id ? plan : p
      );
      state.planDetailsById[plan.Admin_Plan_id] = plan;
    },

    setCreating: (state, action) => {
      state.creating = action.payload;
    },
    setUpdating: (state, action) => {
      state.updating = action.payload;
    },

    // ------ Purchased subscriptions ------
    setSubscriptionHistoryData: (state, action) => {
      state.subscriptionHistory = action.payload.data || [];
      state.subscriptionHistoryPagination = action.payload.pagination || null;
      state.historyLoading = false;
    },
    setSubscriptionHistoryLoading: (state, action) => {
      state.historyLoading = action.payload;
    },

    // ✅ NEW: Push a freshly-created subscription into the history list
    addSubscriptionHistoryItem: (state, action) => {
      const sub = action.payload;
      if (!sub) return;
      state.subscriptionHistory = [sub, ...state.subscriptionHistory];
      if (state.subscriptionHistoryPagination) {
        state.subscriptionHistoryPagination.total =
          (state.subscriptionHistoryPagination.total || 0) + 1;
      }
    },

    resetSubscriptions: () => initialState,
  },
});

export const {
  setSubscriptionsLoading,
  setSubscriptionsData,
  setSubscriptionsError,
  setPlanDetail,
  addSubscriptionPlan,
  updateSubscriptionPlan,
  setCreating,
  setUpdating,
  setSubscriptionHistoryData,
  setSubscriptionHistoryLoading,
  addSubscriptionHistoryItem, 
  resetSubscriptions,
} = subscriptionsSlice.actions;

export default subscriptionsSlice.reducer;