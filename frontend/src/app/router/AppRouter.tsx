import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

// Public Pages
import LandingPage from '../../pages/public/LandingPage';
import LoginPage from '../../pages/auth/LoginPage';
import SignupPage from '../../pages/auth/SignupPage';
import ForgotPasswordPage from '../../pages/auth/ForgotPasswordPage';

// Dashboard Pages
import DashboardPage from '../../pages/dashboard/DashboardPage';
import BookingsPage from '../../pages/dashboard/BookingsPage';
import AnalyticsPage from '../../pages/dashboard/AnalyticsPage';
import StaffPage from '../../pages/dashboard/StaffPage';
import ServicesPage from '../../pages/dashboard/ServicesPage';
import SettingsPage from '../../pages/dashboard/SettingsPage';
import QRCodePage from '../../pages/dashboard/QRCodePage';
import WhatsAppSetupPage from '../../pages/dashboard/WhatsAppSetupPage';
import NotificationsPage from "../../pages/dashboard/NotificationsPage";
import BillingPage from "../../pages/dashboard/BillingPage";
import ReviewsPage from "../../pages/dashboard/ReviewsPage";
import BookingDetailsPage from "../../pages/dashboard/BookingDetailsPage";
import WhatsAppFlowConfig from "../../pages/dashboard/WhatsAppFlowConfig";

import LandingLayout from '../layouts/LandingLayout';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';

const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<LandingLayout />}>
        <Route path="/" element={<LandingPage />} />
      </Route>

      {/* Auth Routes (Public only) */}
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/signup" element={<SignupPage />} />
          <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        </Route>
      </Route>

      {/* Protected Dashboard Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/bookings" element={<BookingsPage />} />
          <Route path="/dashboard/analytics" element={<AnalyticsPage />} />
          <Route path="/dashboard/staff" element={<StaffPage />} />
          <Route path="/dashboard/services" element={<ServicesPage />} />
          <Route path="/dashboard/settings" element={<SettingsPage />} />
          <Route path="/dashboard/qr-code" element={<QRCodePage />} />
          <Route path="/dashboard/whatsapp-setup" element={<WhatsAppSetupPage />} />
          <Route path="/dashboard/whatsapp-flow" element={<WhatsAppFlowConfig />} />
          <Route path="/dashboard/notifications" element={<NotificationsPage />} />
          <Route path="/dashboard/billing" element={<BillingPage />} />
          <Route path="/dashboard/reviews" element={<ReviewsPage />} />
          <Route path="/dashboard/bookings/:id" element={<BookingDetailsPage />} />
        </Route>
      </Route>


      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
