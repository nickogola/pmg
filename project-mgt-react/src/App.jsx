import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layout components
import MainLayout from './components/layouts/MainLayout';

// Authentication components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Landing component
import Landing from './components/landing/Landing';

// Tenant components
import TenantDashboard from './components/tenant/TenantDashboard';
import CreateTicket from './components/tenant/CreateTicket';
import Payment from './components/tenant/Payment';

// Admin components
import AdminDashboard from './components/admin/AdminDashboard';
import ManageTickets from './components/admin/ManageTickets';
import Announcements from './components/admin/Announcements';
import PaymentReports from './components/admin/PaymentReports';
import Tenants from './components/admin/Tenants';
import Leases from './components/admin/Leases';
import SubscriptionManagement from './components/admin/SubscriptionManagement';

// Auth protection
import PrivateRoute from './components/auth/PrivateRoute';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Landing />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        
        {/* Tenant routes */}
        <Route path="tenant" element={<PrivateRoute userType="Tenant" />}>
          <Route path="dashboard" element={<TenantDashboard />} />
          <Route path="create-ticket" element={<CreateTicket />} />
          <Route path="payment" element={<Payment />} />
        </Route>
        
        {/* Admin routes */}
        <Route path="admin" element={<PrivateRoute userType={["Admin", "Landlord"]} />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="manage-tickets" element={<ManageTickets />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="payment-reports" element={<PaymentReports />} />
          <Route path="tenants" element={<Tenants />} />
          <Route path="leases" element={<Leases />} />
          <Route path="subscription" element={<SubscriptionManagement />} />
        </Route>
        
        {/* Catch-all route */}
        <Route path="*" element={<Landing />} />
      </Route>
    </Routes>
  );
}

export default App;
