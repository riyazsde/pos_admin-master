// src/Store/store.js

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Features/auth/authSlice';
import dashboardReducer from './Features/dashboard/dashboardSlice';   // ✅ NEW

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,   // ✅ NEW
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;