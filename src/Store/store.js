// src/Store/store.js

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Features/auth/authSlice';
import dashboardReducer from './Features/dashboard/dashboardSlice';
import clientsReducer from '../Store/Features/clients/clientsSlice';
import subscriptionsReducer from '../Store/Features/subscriptions/subscriptionsSlice';
import reportsReducer from '../Store/Features/reports/reportsSlice';
import languageReducer from '../Store/Features/language/languageSlice';
import auditsReducer from '../Store/Features/audits/auditsSlice';
import posHardwareReducer from '../Store/Features/posHardware/posHardwareSlice';
import supportTicketsReducer from '../Store/Features/supportTickets/supportTicketsSlice';
import hamReducer from '../Store/Features/ham/hamSlice';
import mdmReducer from '../Store/Features/mdm/mdmSlice';
import subadminReducer from '../Store/Features/subadmin/subadminSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    clients: clientsReducer,
    subscriptions: subscriptionsReducer,
    reports: reportsReducer,
     language: languageReducer, 
     audits: auditsReducer,
     posHardware: posHardwareReducer,
     supportTickets: supportTicketsReducer,
      ham: hamReducer,
      mdm: mdmReducer,
      subadmin: subadminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;