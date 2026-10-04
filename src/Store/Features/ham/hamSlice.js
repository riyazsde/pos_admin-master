import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  devices: [],
  totalDevices: 0,

  assignedDevices: [],

  inventory: {
    activeHardware: 0,
    inactiveHardware: 0,
    unpaidHardware: 0,
    totalHardware: 0,
  },

  loading: false,
  creating: false,
  hasLoaded: false,
  error: null,
};

const hamSlice = createSlice({
  name: 'ham',
  initialState,
  reducers: {
    setHamLoading: (state, action) => {
      state.loading = action.payload;
    },
    setDevicesData: (state, action) => {
      state.devices = action.payload.data || [];
      state.totalDevices = action.payload.count ?? 0;
      state.hasLoaded = true;
      state.loading = false;
      state.error = null;
    },
    setAssignedDevicesData: (state, action) => {
      state.assignedDevices = action.payload.data || [];
    },
    setInventoryStatus: (state, action) => {
      if (action.payload?.inventory) {
        state.inventory = action.payload.inventory;
      }
    },
    addDevice: (state, action) => {
      const device = action.payload;
      if (!device) return;
      state.devices = [device, ...state.devices];
      state.totalDevices += 1;
    },
    setCreating: (state, action) => {
      state.creating = action.payload;
    },
    setHamError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.creating = false;
    },
    resetHam: () => initialState,
  },
});

export const {
  setHamLoading,
  setDevicesData,
  setAssignedDevicesData,
  setInventoryStatus,
  addDevice,
  setCreating,
  setHamError,
  resetHam,
} = hamSlice.actions;

export default hamSlice.reducer;