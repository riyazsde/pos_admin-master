// src/Features/subscriptions/subscriptionsSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Plan catalog
  plans: [],
  totalPlans: 0,
  activePlans: 0,

  // Single plan detail (cached by id)
  planDetailsById: {}, // { [id]: planObject }

  // Purchased subscriptions
  subscriptionHistory: [],
  subscriptionHistoryPagination: null,

  // Loading flags
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

    // ------ Single plan (for detail/edit) ------
    setPlanDetail: (state, action) => {
      const plan = action.payload;
      if (plan?.Admin_Plan_id) {
        state.planDetailsById[plan.Admin_Plan_id] = plan;
      }
    },

    // ------ Add newly created plan ------
    addSubscriptionPlan: (state, action) => {
      const plan = action.payload;
      if (!plan) return;
      state.plans = [plan, ...state.plans];
      state.totalPlans += 1;
      if (plan.Status) state.activePlans += 1;
    },

    // ------ Replace updated plan in list ------
    updateSubscriptionPlan: (state, action) => {
      const plan = action.payload;
      if (!plan) return;
      state.plans = state.plans.map((p) =>
        p.Admin_Plan_id === plan.Admin_Plan_id ? plan : p
      );
      state.planDetailsById[plan.Admin_Plan_id] = plan;
    },

    // ------ Loading flags ------
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
  resetSubscriptions,
} = subscriptionsSlice.actions;

export default subscriptionsSlice.reducer;