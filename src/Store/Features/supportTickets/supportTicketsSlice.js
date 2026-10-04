import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Summary
  summary: {
    totalTickets: 0,
    activeTickets: 0,
    resolvedTickets: 0,
  },

  // List
  tickets: [],
  pagination: null,

  // Chart
  chart: [],
  chartFilter: '1Month',

  // Loading flags
  summaryLoading: false,
  ticketsLoading: false,
  chartLoading: false,
  updating: false,

  error: null,
  hasLoaded: false,
};

const supportTicketsSlice = createSlice({
  name: 'supportTickets',
  initialState,
  reducers: {
    // Summary
    setSummaryLoading: (state, action) => {
      state.summaryLoading = action.payload;
    },
    setSummaryData: (state, action) => {
      state.summary = { ...state.summary, ...(action.payload || {}) };
      state.summaryLoading = false;
    },

    // Tickets
    setTicketsLoading: (state, action) => {
      state.ticketsLoading = action.payload;
    },
    setTicketsData: (state, action) => {
      state.tickets = action.payload?.data || [];
      state.pagination = action.payload?.pagination || null;
      state.ticketsLoading = false;
      state.hasLoaded = true;
      state.error = null;
    },

    // Chart
    setChartLoading: (state, action) => {
      state.chartLoading = action.payload;
    },
    setChartData: (state, action) => {
      state.chart = action.payload?.TicketsCharcount || [];
      state.chartLoading = false;
    },
    setChartFilter: (state, action) => {
      state.chartFilter = action.payload;
    },

    // Updating (status / reply)
    setUpdating: (state, action) => {
      state.updating = action.payload;
    },

    // In-place ticket status update
    patchTicketStatus: (state, action) => {
      const { id, status } = action.payload;
      const ticket = state.tickets.find(
        (t) => t.Support_Ticket_id === id
      );
      if (ticket) ticket.Status = status;
    },

    // Error
    setSupportTicketsError: (state, action) => {
      state.error = action.payload;
      state.summaryLoading = false;
      state.ticketsLoading = false;
      state.chartLoading = false;
      state.updating = false;
    },

    resetSupportTickets: () => initialState,
  },
});

export const {
  setSummaryLoading,
  setSummaryData,
  setTicketsLoading,
  setTicketsData,
  setChartLoading,
  setChartData,
  setChartFilter,
  setUpdating,
  patchTicketStatus,
  setSupportTicketsError,
  resetSupportTickets,
} = supportTicketsSlice.actions;

export default supportTicketsSlice.reducer;