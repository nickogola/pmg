import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Auth } from '../../../services/auth';
import { TicketService } from '../../../services/ticket';
import { PaymentService } from '../../../services/payment';

@Component({
  selector: 'app-tenant-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tenant-dashboard.html',
  styleUrl: './tenant-dashboard.scss'
})
export class TenantDashboard implements OnInit {
  userName = '';
  // Aligned with React dashboard data model
  tickets: any[] = [];
  payments: any[] = [];
  announcements: any[] = [];
  loading = {
    tickets: true,
    payments: true,
    announcements: true
  };

  // Legacy fields kept temporarily (can remove after template fully migrated)
  recentTickets: any[] = [];
  paymentHistory: any[] = [];
  upcomingPayment: any = null;
  isLoading = true;

  constructor(
    private authService: Auth,
    private ticketService: TicketService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.userName = `${user.firstName} ${user.lastName}`;
        // Use userId or id, whichever is available
        const userId = user.userId || user.id;
        if (userId) {
          this.loadDashboardData(userId);
          this.simulateReactLikeDataLoad();
        }
      }
    });
  }

  loadDashboardData(userId: number): void {
    // Get recent tickets
    this.ticketService.getTicketsByTenant(userId).subscribe(tickets => {
      this.recentTickets = tickets.slice(0, 3);
      this.isLoading = false;
    });

    // Get payment history
    this.paymentService.getPaymentsByTenant(userId).subscribe(payments => {
      this.paymentHistory = payments.slice(0, 3);
      
      // Find upcoming payment (demo purpose)
      const today = new Date();
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      
      this.upcomingPayment = {
        dueDate: nextMonth.toISOString().split('T')[0],
        amount: 1200.00,
        isPaid: false
      };
    });
  }

  private simulateReactLikeDataLoad(): void {
    // Simulate async loads similar to React component
    setTimeout(() => {
      this.tickets = [
        { id: 1, title: 'Leaking faucet', status: 'Open', createdAt: '2023-10-15' },
        { id: 2, title: 'Broken light fixture', status: 'In Progress', createdAt: '2023-10-10' },
        { id: 3, title: 'AC not working', status: 'Resolved', createdAt: '2023-09-28' }
      ];
      this.loading.tickets = false;
    }, 800);

    setTimeout(() => {
      this.payments = [
        { id: 101, type: 'Rent', amount: 1200.00, status: 'Paid', date: '2023-10-01' },
        { id: 102, type: 'Utility', amount: 150.00, status: 'Paid', date: '2023-10-02' },
        { id: 103, type: 'Rent', amount: 1200.00, status: 'Upcoming', date: '2023-11-01' }
      ];
      this.loading.payments = false;
    }, 1000);

    setTimeout(() => {
      this.announcements = [
        { id: 201, title: 'Building Maintenance', content: 'Water will be shut off from 10am-2pm on Saturday for maintenance.', date: '2023-10-12' },
        { id: 202, title: 'Holiday Schedule', content: 'Office will be closed on November 23-24 for Thanksgiving holiday.', date: '2023-10-05' }
      ];
      this.loading.announcements = false;
    }, 1200);
  }
}
