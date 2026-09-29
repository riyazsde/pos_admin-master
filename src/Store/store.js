// src/Store/store.js

import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../Store/Features/auth/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // Add more slices here as your app grows:
    // products: productReducer,
    // orders: orderReducer,
  },
  // Optional: disable serializable check if you store non-serializable data
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;