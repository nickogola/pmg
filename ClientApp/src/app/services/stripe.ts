import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { environment } from '../../environments/environment';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { CheckoutItem } from '../models/checkoutItem';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private stripe: Stripe | null = null;
  private apiUrl = 'https://localhost:7225/api/payments';
  constructor(private http: HttpClient) {
    this.initStripe();
  }

  // Initializes Stripe with the publishable key 
  private async initStripe() {
    this.stripe = await loadStripe(environment.stripe.publishableKey);
  }
  

  // Creates a checkout session and redirects the user to Stripe checkout
  createCheckoutSession(items: CheckoutItem[]): Observable<void> {
    return this.http.post<{ sessionId: string; }>(
      `${this.apiUrl}/CreateCheckoutSession`,
      items
    ).pipe(
      switchMap(async response => {
        const stripe = await this.stripe;
        if (!stripe) {
          throw new Error('Stripe failed to initialize');
        }

        const { error } = await stripe.redirectToCheckout({
          sessionId: response.sessionId // Redirect to Stripe checkout using sessionId from server
        });

        if (error) {
          throw new Error(error.message);
        }
      })
    );
  }
}