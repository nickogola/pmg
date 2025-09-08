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
}
