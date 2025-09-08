import { Routes } from '@angular/router';

// Import components
import { Login } from './components/shared/login/login';
import { TenantDashboard } from './components/tenant/tenant-dashboard/tenant-dashboard';
import { CreateTicket } from './components/tenant/create-ticket/create-ticket';
import { Payment } from './components/tenant/payment/payment';
import { AdminDashboard } from './components/admin/admin-dashboard/admin-dashboard';
import { ManageTickets } from './components/admin/manage-tickets/manage-tickets';
import { Announcements } from './components/admin/announcements/announcements';
import { PaymentReports } from './components/admin/payment-reports/payment-reports';
import { Tenants } from './components/admin/tenants/tenants';
import { AdminLeasesComponent } from './components/admin/leases/leases';
import { LandingComponent } from './components/landing/landing';
import { SubscriptionManagementComponent } from './components/admin/subscription/subscription-management';
import { RegisterComponent } from './components/auth/register/register';


export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: Login },
  { path: 'register', component: RegisterComponent },

  // Tenant routes
  { path: 'tenant/dashboard', component: TenantDashboard },
  { path: 'tenant/create-ticket', component: CreateTicket },
  { path: 'tenant/payment', component: Payment },
  
  // Admin routes
  { path: 'admin/dashboard', component: AdminDashboard },
  { path: 'admin/manage-tickets', component: ManageTickets },
  { path: 'admin/announcements', component: Announcements },
  { path: 'admin/payment-reports', component: PaymentReports },
  { path: 'admin/tenants', component: Tenants },
  { path: 'admin/leases', component: AdminLeasesComponent },
  { path: 'admin/subscription', component: SubscriptionManagementComponent },
  
  // Fallback route
  { path: '**', redirectTo: '/' }
];
