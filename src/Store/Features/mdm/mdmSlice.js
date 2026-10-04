import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  devices: [],
  totalDevices: 0,

  sessionLogs: [],
  sessionLogsDevice: null,

  loading: false,
  actionLoading: false,
  hasLoaded: false,
  error: null,
};

const mdmSlice = createSlice({
  name: 'mdm',
  initialState,
  reducers: {
    setMdmLoading: (state, action) => {
      state.loading = action.payload;
    },
    setActionLoading: (state, action) => {
      state.actionLoading = action.payload;
    },
    setDevicesData: (state, action) => {
      state.devices = action.payload.data || [];
      state.totalDevices = action.payload.count ?? 0;
      state.hasLoaded = true;
      state.loading = false;
      state.error = null;
    },
    // ✅ In-place update after lock/restart/update/wipe
    patchDevice: (state, action) => {
      const { id, changes } = action.payload;
      const device = state.devices.find(
        (d) => d.MyDevices_id === id || String(d.MyDevices_id) === String(id)
      );
      if (device) Object.assign(device, changes);
    },
    setSessionLogs: (state, action) => {
      state.sessionLogs = action.payload.logs || [];
      state.sessionLogsDevice = action.payload.device || null;
    },
    setMdmError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.actionLoading = false;
    },
    resetMdm: () => initialState,
  },
});

export const {
  setMdmLoading,
  setActionLoading,
  setDevicesData,
  patchDevice,
  setSessionLogs,
  setMdmError,
  resetMdm,
} = mdmSlice.actions;

export default mdmSlice.reducer;