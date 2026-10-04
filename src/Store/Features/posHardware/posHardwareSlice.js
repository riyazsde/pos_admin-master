// src/Features/posHardware/posHardwareSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // KPI values
  totalClients: 0,
  totalPrinters: 0,
  totalSystems: 0,
  totalHardwareSold: 0,
  hardwareSalesChange: '0%',

  // Chart data: [{ month, count, revenue }]
  monthlyBreakdown: [],

  lastUpdated: null,

  loading: false,
  error: null,
  hasLoaded: false,
};

const posHardwareSlice = createSlice({
  name: 'posHardware',
  initialState,
  reducers: {
    setPosHardwareLoading: (state, action) => {
      state.loading = action.payload;
    },
    setPosHardwareData: (state, action) => {
      const data = action.payload || {};
      state.totalClients = data.totalClients ?? 0;
      state.totalPrinters = data.totalPrinters ?? 0;
      state.totalSystems = data.totalSystems ?? 0;
      state.totalHardwareSold = data.totalHardwareSold ?? 0;
      state.hardwareSalesChange = data.hardwareSalesChange ?? '0%';
      state.monthlyBreakdown = data.monthlyBreakdown || [];
      state.lastUpdated = data.lastUpdated || null;
      state.loading = false;
      state.hasLoaded = true;
      state.error = null;
    },
    setPosHardwareError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    resetPosHardware: () => initialState,
  },
});

export const {
  setPosHardwareLoading,
  setPosHardwareData,
  setPosHardwareError,
  resetPosHardware,
} = posHardwareSlice.actions;

export default posHardwareSlice.reducer;