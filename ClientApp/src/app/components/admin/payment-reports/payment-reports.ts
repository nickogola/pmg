import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Payment } from '../../../models/payment';
import { PaymentService } from '../../../services/payment';

@Component({
  selector: 'app-payment-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './payment-reports.html',
  styleUrl: './payment-reports.scss'
})
export class PaymentReports implements OnInit {
  payments: Payment[] = [];
  filteredPayments: Payment[] = [];
  isLoading = true;
  
  // Filter properties
  searchTerm = '';
  statusFilter = 'all';
  dateRangeFilter = 'all';
  unitFilter = 'all';
  startDate: string = '';
  endDate: string = '';

  // Summary statistics
  totalPaid = 0;
  totalDue = 0;
  totalLate = 0;
  paymentCounts = {
    completed: 0,
    pending: 0,
    late: 0,
    total: 0
  };

  // For chart data (mock structure)
  monthlyPayments = [
    { month: 'Jan', paid: 0, due: 0 },
    { month: 'Feb', paid: 0, due: 0 },
    { month: 'Mar', paid: 0, due: 0 },
    { month: 'Apr', paid: 0, due: 0 },
    { month: 'May', paid: 0, due: 0 },
    { month: 'Jun', paid: 0, due: 0 },
    { month: 'Jul', paid: 0, due: 0 },
    { month: 'Aug', paid: 0, due: 0 },
    { month: 'Sep', paid: 0, due: 0 },
    { month: 'Oct', paid: 0, due: 0 },
    { month: 'Nov', paid: 0, due: 0 },
    { month: 'Dec', paid: 0, due: 0 }
  ];
  
  constructor(private paymentService: PaymentService) {}
  
  ngOnInit(): void {
    this.loadPayments();
    
    // Set default date range to current month
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    this.startDate = firstDay.toISOString().split('T')[0];
    this.endDate = lastDay.toISOString().split('T')[0];
  }
  
  loadPayments(): void {
    this.isLoading = true;
    this.paymentService.getPayments().subscribe({
      next: (data: Payment[]) => {
        this.payments = data;
        this.filteredPayments = [...data];
        this.calculateStatistics();
        this.populateChartData();
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading payments', error);
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.payments];
    
    // Apply status filter
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status === this.statusFilter);
    }
    
    // Apply date range filter
    if (this.dateRangeFilter === 'custom' && this.startDate && this.endDate) {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      end.setHours(23, 59, 59); // Include the full end day
      
      filtered = filtered.filter(p => {
        const paymentDate = new Date(p.paymentDate || p.date || new Date());
        return paymentDate >= start && paymentDate <= end;
      });
    } else if (this.dateRangeFilter === 'thisMonth') {
      const today = new Date();
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      lastDay.setHours(23, 59, 59);
      
      filtered = filtered.filter(p => {
        const paymentDate = new Date(p.paymentDate || p.date || new Date());
        return paymentDate >= firstDay && paymentDate <= lastDay;
      });
    } else if (this.dateRangeFilter === 'lastMonth') {
      const today = new Date();
      const firstDay = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lastDay = new Date(today.getFullYear(), today.getMonth(), 0);
      lastDay.setHours(23, 59, 59);
      
      filtered = filtered.filter(p => {
        const paymentDate = new Date(p.paymentDate || p.date || new Date());
        return paymentDate >= firstDay && paymentDate <= lastDay;
      });
    } else if (this.dateRangeFilter === 'last3Months') {
      const today = new Date();
      const firstDay = new Date(today.getFullYear(), today.getMonth() - 3, 1);
      const lastDay = new Date();
      lastDay.setHours(23, 59, 59);
      
      filtered = filtered.filter(p => {
        const paymentDate = new Date(p.paymentDate || p.date || new Date());
        return paymentDate >= firstDay && paymentDate <= lastDay;
      });
    } else if (this.dateRangeFilter === 'thisYear') {
      const firstDay = new Date(new Date().getFullYear(), 0, 1);
      const lastDay = new Date(new Date().getFullYear(), 11, 31);
      lastDay.setHours(23, 59, 59);
      
      filtered = filtered.filter(p => {
        const paymentDate = new Date(p.paymentDate || p.date || new Date());
        return paymentDate >= firstDay && paymentDate <= lastDay;
      });
    }
    
    // Apply unit filter
    if (this.unitFilter !== 'all') {
      const unitId = Number(this.unitFilter);
      filtered = filtered.filter(p => p.unitId === unitId);
    }
    
    // Apply search term
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.tenantName?.toLowerCase().includes(searchLower) ||
        p.unitNumber?.toLowerCase().includes(searchLower) ||
        p.notes?.toLowerCase().includes(searchLower) ||
        p.paymentMethod?.toLowerCase().includes(searchLower) ||
        p.id?.toString().includes(searchLower)
      );
    }
    
    this.filteredPayments = filtered;
    this.calculateStatistics();
  }
  
  calculateStatistics(): void {
    this.totalPaid = this.filteredPayments
      .filter(p => p.status === 'Completed' || p.status === 'Paid')
      .reduce((sum, payment) => sum + (payment.amount || 0), 0);
      
    this.totalDue = this.filteredPayments
      .filter(p => p.status === 'Pending')
      .reduce((sum, payment) => sum + (payment.amount || 0), 0);
      
    this.totalLate = this.filteredPayments
      .filter(p => p.status === 'Late')
      .reduce((sum, payment) => sum + (payment.amount || 0), 0);
    
    this.paymentCounts = {
      completed: this.filteredPayments.filter(p => p.status === 'Completed' || p.status === 'Paid').length,
      pending: this.filteredPayments.filter(p => p.status === 'Pending').length,
      late: this.filteredPayments.filter(p => p.status === 'Late').length,
      total: this.filteredPayments.length
    };
  }
  
  populateChartData(): void {
    // Reset chart data
    this.monthlyPayments = this.monthlyPayments.map(m => ({ ...m, paid: 0, due: 0 }));
    
    // Group payments by month
    this.payments.forEach(payment => {
      const date = new Date(payment.paymentDate || payment.date || new Date());
      const monthIndex = date.getMonth();
      
      if (payment.status === 'Completed' || payment.status === 'Paid') {
        this.monthlyPayments[monthIndex].paid += payment.amount || 0;
      } else {
        this.monthlyPayments[monthIndex].due += payment.amount || 0;
      }
    });
  }
  
  exportReport(): void {
    // In a real app, this would generate a CSV or PDF
    alert('Report exported successfully! (This is a mock function)');
  }
  
  getStatusClass(status: string): string {
    switch (status) {
      case 'Completed':
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Late':
      case 'Failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
  
  formatCurrency(amount: number): string {
    return amount.toLocaleString('en-US', { 
      style: 'currency', 
      currency: 'USD' 
    });
  }
}
