// src/Store/store.js

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Features/auth/authSlice';
import dashboardReducer from './Features/dashboard/dashboardSlice';   
import clientsReducer from '../Store/Features/clients/clientsSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,  
    clients: clientsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;