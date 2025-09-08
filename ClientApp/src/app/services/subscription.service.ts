import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  billingPeriod: string;
  features: string[];
  limitations?: string[];
  recommended?: boolean;
}

export interface SubscriptionRequest {
  userId: string;
  planId: string;
  planName: string;
  amount: number;
  interval: string;
}

export interface SubscriptionResponse {
  subscriptionId: string;
  checkoutUrl?: string;
  status: string;
  message: string;
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  planName: string;
  status: string;
  startDate: string;
  endDate: string;
  trialEndDate?: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  amount: number;
  interval: string;
  paymentMethod?: string;
  lastFourDigits?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private apiUrl = `${environment.apiUrl}/api/subscriptions`;

  constructor(private http: HttpClient) { }

  /**
   * Get all available subscription plans
   */
  getPlans(): Observable<SubscriptionPlan[]> {
    return this.http.get<SubscriptionPlan[]>(`${this.apiUrl}/plans`);
  }

  /**
   * Get a user's current subscription
   * @param userId The user's ID
   */
  getUserSubscription(userId: string): Observable<UserSubscription> {
    return this.http.get<UserSubscription>(`${this.apiUrl}/user/${userId}`);
  }

  /**
   * Create a new subscription
   * @param subscriptionRequest The subscription request data
   */
  createSubscription(subscriptionRequest: SubscriptionRequest): Observable<SubscriptionResponse> {
    return this.http.post<SubscriptionResponse>(`${this.apiUrl}`, subscriptionRequest);
  }

  /**
   * Cancel a subscription
   * @param subscriptionId The subscription ID to cancel
   */
  cancelSubscription(subscriptionId: string): Observable<SubscriptionResponse> {
    return this.http.post<SubscriptionResponse>(`${this.apiUrl}/${subscriptionId}/cancel`, {});
  }

  /**
   * Resume a canceled subscription
   * @param subscriptionId The subscription ID to resume
   */
  resumeSubscription(subscriptionId: string): Observable<SubscriptionResponse> {
    return this.http.post<SubscriptionResponse>(`${this.apiUrl}/${subscriptionId}/resume`, {});
  }

  /**
   * Change a subscription plan
   * @param subscriptionId The subscription ID to update
   * @param newPlanId The new plan ID
   */
  changePlan(subscriptionId: string, newPlanId: string): Observable<SubscriptionResponse> {
    return this.http.post<SubscriptionResponse>(`${this.apiUrl}/${subscriptionId}/change-plan`, { newPlanId });
  }

  /**
   * Update payment method for subscription
   * @param subscriptionId The subscription ID
   * @param paymentMethodId The new payment method ID
   */
  updatePaymentMethod(subscriptionId: string, paymentMethodId: string): Observable<SubscriptionResponse> {
    return this.http.post<SubscriptionResponse>(`${this.apiUrl}/${subscriptionId}/payment-method`, { paymentMethodId });
  }

  /**
   * Get invoice history for a user
   * @param userId The user's ID
   */
  getInvoices(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}/invoices`);
  }

  /**
   * Handle webhook events from payment provider
   * @param event The webhook event data
   */
  handleWebhook(event: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/webhook`, event);
  }
}
