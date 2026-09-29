import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignInPage from '../../Components/SignIn/SignIn';
import ForgotPassword from '../../Components/SignIn/ForgotPassword';
import VerifyOtp from '../../Components/SignIn/VerifyOtp';
import SetNewPassword from '../../Components/SignIn/SetNewPassword';
import PasswordSuccess from '../../Components/SignIn/PasswordSuccess';
import AdminPanel from '../AdminPanel/withAdminLayout';
import Dashboard from '../Dashboard/Dashboard';
import TopPerformers from '../../Components/Dashboard/TopPerformers';
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




const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<SignInPage />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/verify-otp" element={<VerifyOtp />} />
                <Route path="/set-new-password" element={<SetNewPassword />} />


                <Route path="/password-success" element={<PasswordSuccess />} />
                <Route path="/Dashboard" element={< Dashboard />} />
                <Route path="/top-performers-list" element={< TopPerformersMain />} />
                <Route path="/clients" element={< Clients />} />
                <Route path="/create-clients" element={< CreateClientForm />} />
                <Route path="/client-details" element={< ClientDetails />} />
                <Route path="/renew-management" element={< SubscriptionManagement />} />
                <Route path="/subscription-list" element={< SubscriptionTable />} />
                <Route path="/report" element={< Report />} />
                <Route path="/audit-log" element={< AuditLogTable />} />
                <Route path="/supports" element={< SupportsPage />} />
                <Route path="/ticket-details" element={< TicketDetails />} />
                <Route path="/notifications" element={< Notifications />} />
                <Route path="/pos-device" element={< PosDevice />} />
                <Route path="/pos-device-history" element={< HardwareDeviceHistory />} />
                <Route path="/settings" element={< AccountSettings />} />
                <Route path="/sub-admin" element={< SubAdminTable />} />
                <Route path="/change-password" element={< ChangePasswordForm />} />
                <Route path="/account-management" element={< AccountManagement />} />
                <Route path="/device" element={< DeviceActivity />} />
                <Route path="/language" element={< LanguageSettings />} />
                <Route path="/date-time" element={< DateTimeSettings />} />
                <Route path="/currency" element={< CurrencySettings />} />
                                <Route path="/currency" element={< CurrencySettings />} />
                <Route path="/billing-history" element={< BillingHistory  />} />























            </Routes>
        </Router>
    );
};

export default AppRoutes;
