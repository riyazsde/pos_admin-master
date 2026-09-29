import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Auth pages
import SignInPage from '../../Components/SignIn/SignIn';
import ForgotPassword from '../../Components/SignIn/ForgotPassword';
import VerifyOtp from '../../Components/SignIn/VerifyOtp';
import SetNewPassword from '../../Components/SignIn/SetNewPassword';
import PasswordSuccess from '../../Components/SignIn/PasswordSuccess';

// Protected pages
import Dashboard from '../Dashboard/Dashboard';
import TopPerformersMain from '../../Components/TopPerformers/TopPerformersMain';
import Clients from '../../Components/Clients/Clients';
import CreateClientForm from '../../Components/Clients/CreateClientForm';
import ClientDetails from '../../Components/Clients/ClientDetails';
import SubscriptionManagement from '../../Components/Clients/SubscriptionManagement';
import SubscriptionTable from '../../Components/SubscriptionTable/SubscriptionTable';
import Report from '../Report/Report';
import AuditLogTable from '../../Components/Audits/AuditLogTable';
import SupportsPage from '../SupportsPage/SupportsPage';
import TicketDetails from '../../Components/Supports/TicketDetails';
import Notifications from '../../Components/Topbar/Notifications';
import PosDevice from '../PosDevice/PosDevice';
import HardwareDeviceHistory from '../../Components/PosDevice/HardwareDeviceHistory';
import AccountSettings from '../AccountSettings/AccountSettings';
import SubAdminTable from '../../Components/Settings/SubAdminTable';
import ChangePasswordForm from '../../Components/Settings/ChangePasswordForm';
import AccountManagement from '../../Components/Settings/AccountManagement';
import DeviceActivity from '../../Components/Settings/DeviceActivity';
import LanguageSettings from '../../Components/Settings/LanguageSettings';
import DateTimeSettings from '../../Components/Settings/DateTimeSettings';
import CurrencySettings from '../../Components/Settings/CurrencySettings';
import BillingHistory from '../../Components/Settings/BillingHistory';

// Guards + 404
import NotFound from '../NotFound/NotFound';
import ProtectedRoute from '../../Routes/ProtectedRoute';
import PublicRoute from '../../Routes/PublicRoute';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<PublicRoute><SignInPage /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/verify-otp" element={<PublicRoute><VerifyOtp /></PublicRoute>} />
        <Route path="/set-new-password" element={<PublicRoute><SetNewPassword /></PublicRoute>} />
        <Route path="/password-success" element={<PublicRoute><PasswordSuccess /></PublicRoute>} />

        {/* Protected routes */}
        <Route path="/Dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/top-performers-list" element={<ProtectedRoute><TopPerformersMain /></ProtectedRoute>} />
        <Route path="/clients" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
        <Route path="/create-clients" element={<ProtectedRoute><CreateClientForm /></ProtectedRoute>} />
        <Route path="/client-details" element={<ProtectedRoute><ClientDetails /></ProtectedRoute>} />
        <Route path="/renew-management" element={<ProtectedRoute><SubscriptionManagement /></ProtectedRoute>} />
        <Route path="/subscription-list" element={<ProtectedRoute><SubscriptionTable /></ProtectedRoute>} />
        <Route path="/report" element={<ProtectedRoute><Report /></ProtectedRoute>} />
        <Route path="/audit-log" element={<ProtectedRoute><AuditLogTable /></ProtectedRoute>} />
        <Route path="/supports" element={<ProtectedRoute><SupportsPage /></ProtectedRoute>} />
        <Route path="/ticket-details" element={<ProtectedRoute><TicketDetails /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/pos-device" element={<ProtectedRoute><PosDevice /></ProtectedRoute>} />
        <Route path="/pos-device-history" element={<ProtectedRoute><HardwareDeviceHistory /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><AccountSettings /></ProtectedRoute>} />
        <Route path="/sub-admin" element={<ProtectedRoute><SubAdminTable /></ProtectedRoute>} />
        <Route path="/change-password" element={<ProtectedRoute><ChangePasswordForm /></ProtectedRoute>} />
        <Route path="/account-management" element={<ProtectedRoute><AccountManagement /></ProtectedRoute>} />
        <Route path="/device" element={<ProtectedRoute><DeviceActivity /></ProtectedRoute>} />
        <Route path="/language" element={<ProtectedRoute><LanguageSettings /></ProtectedRoute>} />
        <Route path="/date-time" element={<ProtectedRoute><DateTimeSettings /></ProtectedRoute>} />
        <Route path="/currency" element={<ProtectedRoute><CurrencySettings /></ProtectedRoute>} />
        <Route path="/billing-history" element={<ProtectedRoute><BillingHistory /></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;