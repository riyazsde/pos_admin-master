// src/Features/reports/reportsSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    // KPI metrics
    kpiMetrics: {
        totalActiveClients: 0,
        totalInactiveClients: 0,
        totalRenewalRate: 0,
        totalActiveSubscriptions: 0,
        totalRevenue: 0,
        newSubscriptionsThisMonth: 0,
        renewedSubscriptionsThisMonth: 0,
        conversionRate: '0',
    },
    activeClients: [],
    activeClientsPagination: null,
    activeClientsLoading: false,

    inactiveClients: [],
    inactiveClientsPagination: null,
    inactiveClientsLoading: false,
    subscriptionSales: null,
    subscriptionSalesLoading: false,
    latestTransactions: [],
    latestTransactionsSummary: null,
    latestTransactionsPagination: null,
    latestTransactionsLoading: false,
    supportTicketsReport: [],
    supportTicketsReportPagination: null,
    supportTicketsReportLoading: false,

    transactionGraph: null,
    transactionGraphLoading: false,
    cityWiseUsage: [],
    cityWiseUsageSummary: null,
    cityWiseUsagePagination: null,
    cityWiseUsageLoading: false,
    // Charts
    charts: {
        activeClientsBreakdown: {
            newClients: 0,
            renewedClients: 0,
        },
    },

    loading: false,
    error: null,
    hasLoaded: false,
};

const reportsSlice = createSlice({
    name: 'reports',
    initialState,
    reducers: {
        setReportsLoading: (state, action) => {
            state.loading = action.payload;
        },
        setReportsData: (state, action) => {
            const { kpiMetrics, charts } = action.payload || {};
            if (kpiMetrics) state.kpiMetrics = { ...state.kpiMetrics, ...kpiMetrics };
            if (charts) state.charts = { ...state.charts, ...charts };
            state.hasLoaded = true;
            state.loading = false;
            state.error = null;
        },
        setReportsError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        setActiveClientsData: (state, action) => {
            state.activeClients = action.payload.data || [];
            state.activeClientsPagination = action.payload.pagination || null;
            state.activeClientsLoading = false;
        },
        setActiveClientsLoading: (state, action) => {
            state.activeClientsLoading = action.payload;
        },
        setInactiveClientsData: (state, action) => {
            state.inactiveClients = action.payload.data || [];
            state.inactiveClientsPagination = action.payload.pagination || null;
            state.inactiveClientsLoading = false;
        },
        setInactiveClientsLoading: (state, action) => {
            state.inactiveClientsLoading = action.payload;
        },
        setSubscriptionSalesData: (state, action) => {
            state.subscriptionSales = action.payload;
            state.subscriptionSalesLoading = false;
        },
        setSubscriptionSalesLoading: (state, action) => {
            state.subscriptionSalesLoading = action.payload;
        },
        setLatestTransactionsData: (state, action) => {
            state.latestTransactions = action.payload.data || [];
            state.latestTransactionsSummary = action.payload.summary || null;
            state.latestTransactionsPagination = action.payload.pagination || null;
            state.latestTransactionsLoading = false;
        },
        setLatestTransactionsLoading: (state, action) => {
            state.latestTransactionsLoading = action.payload;
        },

        setTransactionGraphData: (state, action) => {
            state.transactionGraph = action.payload;
            state.transactionGraphLoading = false;
        },
        setTransactionGraphLoading: (state, action) => {
            state.transactionGraphLoading = action.payload;
        },
        setSupportTicketsReportData: (state, action) => {
            state.supportTicketsReport = action.payload.data || [];
            state.supportTicketsReportPagination = action.payload.pagination || null;
            state.supportTicketsReportLoading = false;
        },
        setSupportTicketsReportLoading: (state, action) => {
            state.supportTicketsReportLoading = action.payload;
        },
        setCityWiseUsageData: (state, action) => {
            state.cityWiseUsage = action.payload.data || [];
            state.cityWiseUsageSummary = action.payload.summary || null;
            state.cityWiseUsagePagination = action.payload.pagination || null;
            state.cityWiseUsageLoading = false;
        },
        setCityWiseUsageLoading: (state, action) => {
            state.cityWiseUsageLoading = action.payload;
        },

        resetReports: () => initialState,
    },
});

export const {
    setReportsLoading,
    setReportsData,
    setReportsError,
    resetReports,
    setActiveClientsData,
    setActiveClientsLoading,
    setInactiveClientsData,
    setInactiveClientsLoading,
    setSubscriptionSalesData,
    setSubscriptionSalesLoading,
    setLatestTransactionsData,
    setLatestTransactionsLoading,
    setTransactionGraphData,
    setTransactionGraphLoading,
    setSupportTicketsReportData,
    setSupportTicketsReportLoading,
    setCityWiseUsageData,
    setCityWiseUsageLoading,
} = reportsSlice.actions;

export default reportsSlice.reducer;