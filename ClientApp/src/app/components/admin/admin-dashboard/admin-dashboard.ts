import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Auth } from '../../../services/auth';
import { TicketService } from '../../../services/ticket';
import { PaymentService } from '../../../services/payment';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss'
})
export class AdminDashboard implements OnInit {
  userName = '';
  openTicketsCount = 0;
  resolvedTicketsCount = 0;
  totalPayments = 0;
  paymentsDue = 0;
  recentTickets: any[] = [];
  recentPayments: any[] = [];
  isLoading = true;

  constructor(
    public authService: Auth,
    private ticketService: TicketService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.userName = `${user.firstName} ${user.lastName}`;
        this.loadDashboardData();
      }
    });
  }

  loadDashboardData(): void {
    // Get tickets statistics
    this.ticketService.getTickets().subscribe(tickets => {
      this.recentTickets = tickets.slice(0, 5);
      this.openTicketsCount = tickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length;
      this.resolvedTicketsCount = tickets.filter(t => t.status === 'Resolved').length;
      this.isLoading = false;
    });

    // Get payment statistics
    this.paymentService.getPayments().subscribe(payments => {
      this.recentPayments = payments.slice(0, 5);
      
      // Calculate total payments received
      this.totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0);
      
      // Demo data for payments due
      this.paymentsDue = 3500;
    });
  }
}
