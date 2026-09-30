// src/Features/clients/clientsSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // List
  clients: [],
  totalCount: 0,
  listLoading: false,
  listError: null,

  // Details (keyed by client id for caching)
  detailsById: {}, // { [clientsId]: { data, loading, error } }
};

const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    // LIST
    setClientsLoading: (state, action) => {
      state.listLoading = action.payload;
    },
    setClientsData: (state, action) => {
      state.clients = action.payload.data || [];
      state.totalCount = action.payload.count ?? 0;
      state.listLoading = false;
      state.listError = null;
    },
    setClientsError: (state, action) => {
      state.listError = action.payload;
      state.listLoading = false;
    },

    // DETAILS
    setClientDetailLoading: (state, action) => {
      const { id, loading } = action.payload;
      if (!state.detailsById[id]) {
        state.detailsById[id] = { data: null, loading: false, error: null };
      }
      state.detailsById[id].loading = loading;
    },
    setClientDetailData: (state, action) => {
      const { id, data } = action.payload;
      state.detailsById[id] = { data, loading: false, error: null };
    },
    setClientDetailError: (state, action) => {
      const { id, error } = action.payload;
      if (!state.detailsById[id]) {
        state.detailsById[id] = { data: null, loading: false, error: null };
      }
      state.detailsById[id].error = error;
      state.detailsById[id].loading = false;
    },

    resetClients: () => initialState,
  },
});

export const {
  setClientsLoading,
  setClientsData,
  setClientsError,
  setClientDetailLoading,
  setClientDetailData,
  setClientDetailError,
  resetClients,
} = clientsSlice.actions;

export default clientsSlice.reducer;