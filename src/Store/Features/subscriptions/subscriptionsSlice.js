// src/Features/subscriptions/subscriptionsSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    // Plan catalog
    plans: [],
    totalPlans: 0,
    activePlans: 0,
    subscriptionHistory: [],
    subscriptionHistoryPagination: null,
    historyLoading: false,
    // Loading flags
    loading: false,
    creating: false,
    error: null,
    hasLoaded: false,
};

const subscriptionsSlice = createSlice({
    name: 'subscriptions',
    initialState,
    reducers: {
        setSubscriptionsLoading: (state, action) => {
            state.loading = action.payload;
        },
        setSubscriptionsData: (state, action) => {
            // Supports both { data, count } and dashboard shape
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

        // ✅ Add newly created plan to the top of the list
        addSubscriptionPlan: (state, action) => {
            const plan = action.payload;
            if (!plan) return;
            state.plans = [plan, ...state.plans];
            state.totalPlans = state.totalPlans + 1;
            if (plan.Status) state.activePlans = state.activePlans + 1;
        },

        setCreating: (state, action) => {
            state.creating = action.payload;
        },
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
    addSubscriptionPlan,
    setCreating,
    resetSubscriptions,
    setSubscriptionHistoryData,
    setSubscriptionHistoryLoading,
} = subscriptionsSlice.actions;

export default subscriptionsSlice.reducer;