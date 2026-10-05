// src/Features/subadmin/subadminSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  subadmins: [],
  pagination: null,
  profile: null,

  loading: false,
  profileLoading: false,
  updating: false,
  deleting: false,

  error: null,
  hasLoaded: false,
};

const subadminSlice = createSlice({
  name: 'subadmin',
  initialState,
  reducers: {
    setSubadminsLoading: (state, action) => {
      state.loading = action.payload;
    },
    setSubadminsData: (state, action) => {
      state.subadmins = action.payload.data || [];
      state.pagination = action.payload.pagination || null;
      state.hasLoaded = true;
      state.loading = false;
      state.error = null;
    },
    setSubadminsError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Profile (current user)
    setProfileLoading: (state, action) => {
      state.profileLoading = action.payload;
    },
    setProfile: (state, action) => {
      state.profile = action.payload;
      state.profileLoading = false;
    },

    // Update in place (after edit)
    updateSubadminInList: (state, action) => {
      const updated = action.payload;
      if (!updated) return;
      state.subadmins = state.subadmins.map((s) =>
        s.user_id === updated.user_id ? { ...s, ...updated } : s
      );
    },

    // Remove from list (after delete)
    removeSubadminFromList: (state, action) => {
      const id = action.payload;
      state.subadmins = state.subadmins.filter((s) => s.user_id !== id);
      if (state.pagination) {
        state.pagination.total = Math.max(0, state.pagination.total - 1);
      }
    },

    // Toggle Status in list (after activate/deactivate)
    patchSubadminStatus: (state, action) => {
      const { id, status } = action.payload;
      const item = state.subadmins.find((s) => s.user_id === id);
      if (item) item.Status = status;
    },

    setUpdating: (state, action) => {
      state.updating = action.payload;
    },
    setDeleting: (state, action) => {
      state.deleting = action.payload;
    },

    resetSubadmin: () => initialState,
  },
});

export const {
  setSubadminsLoading,
  setSubadminsData,
  setSubadminsError,
  setProfileLoading,
  setProfile,
  updateSubadminInList,
  removeSubadminFromList,
  patchSubadminStatus,
  setUpdating,
  setDeleting,
  resetSubadmin,
} = subadminSlice.actions;

export default subadminSlice.reducer;