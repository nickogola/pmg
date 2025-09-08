import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { SubscriptionService, UserSubscription } from '../../../services/subscription.service';
import { Auth } from '../../../services/auth';

@Component({
  selector: 'app-subscription-management',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './subscription-management.html',
  styleUrls: ['./subscription-management.scss']
})
export class SubscriptionManagementComponent implements OnInit {
  subscription: UserSubscription | null = null;
  invoices: any[] = [];
  isLoading = true;
  error: string | null = null;
  userId: string = '';
  
  constructor(
    private subscriptionService: SubscriptionService,
    private authService: Auth,
    private router: Router
  ) { }
  
  ngOnInit(): void {
    this.loadUserData();
  }
  
  async loadUserData(): Promise<void> {
    try {
      this.isLoading = true;
      
      // Get current user from auth service
      const currentUser = await firstValueFrom(this.authService.currentUser$);
      if (!currentUser || !currentUser.userId) {
        throw new Error('User not authenticated');
      }
      this.userId = currentUser.userId.toString();
      
      // Load subscription information
      await this.loadSubscriptionInfo();
      
      // Load invoices
      await this.loadInvoices();
    } catch (error) {
      console.error('Error loading subscription data:', error);
      this.error = 'Failed to load subscription information. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }
  
  async loadSubscriptionInfo(): Promise<void> {
    try {
      this.subscription = await firstValueFrom(this.subscriptionService.getUserSubscription(this.userId));
    } catch (error) {
      console.error('Error loading subscription:', error);
      // User may not have a subscription yet
      this.subscription = null;
    }
  }
  
  async loadInvoices(): Promise<void> {
    try {
      this.invoices = await firstValueFrom(this.subscriptionService.getInvoices(this.userId));
    } catch (error) {
      console.error('Error loading invoices:', error);
      this.invoices = [];
    }
  }
  
  async cancelSubscription(): Promise<void> {
    if (!this.subscription) return;
    
    if (confirm('Are you sure you want to cancel your subscription? You will still have access until the end of your current billing period.')) {
      try {
        await firstValueFrom(this.subscriptionService.cancelSubscription(this.subscription.id));
        await this.loadSubscriptionInfo();
        alert('Your subscription has been canceled and will end on ' + 
            new Date(this.subscription.currentPeriodEnd).toLocaleDateString());
      } catch (error) {
        console.error('Error canceling subscription:', error);
        alert('Failed to cancel subscription. Please try again.');
      }
    }
  }
  
  async resumeSubscription(): Promise<void> {
    if (!this.subscription) return;
    
    try {
      await firstValueFrom(this.subscriptionService.resumeSubscription(this.subscription.id));
      await this.loadSubscriptionInfo();
      alert('Your subscription has been resumed successfully.');
    } catch (error) {
      console.error('Error resuming subscription:', error);
      alert('Failed to resume subscription. Please try again.');
    }
  }
  
  upgradePlan(): void {
    this.router.navigate(['/admin/subscription/upgrade']);
  }
  
  updatePaymentMethod(): void {
    this.router.navigate(['/admin/subscription/payment-method']);
  }
  
  formatDate(dateString: string): string {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  }
  
  getFormattedPeriod(subscription: UserSubscription): string {
    if (!subscription) return '';
    
    const start = new Date(subscription.currentPeriodStart).toLocaleDateString();
    const end = new Date(subscription.currentPeriodEnd).toLocaleDateString();
    return `${start} - ${end}`;
  }
  
  getRemainingDays(subscription: UserSubscription): number {
    if (!subscription) return 0;
    
    const today = new Date();
    const endDate = new Date(subscription.currentPeriodEnd);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }
}
