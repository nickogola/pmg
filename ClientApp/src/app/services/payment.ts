import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Payment, PaymentBody } from '../models/payment';
import { Stripe } from '@stripe/stripe-js/dist/stripe-js/stripe';
import { loadStripe } from '@stripe/stripe-js';

@Injectable({
  providedIn: 'root'
})
export class PaymentService implements OnInit {
  private apiUrl = 'https://localhost:7225/api/payments';
  stripe: Stripe | null = null;
  cardElement: any; // Stripe Element
  // Mock data for development
  private mockPayments: Payment[] = [
    {
      id: 1,
      tenantId: 1,
      propertyId: 1,
      unitId: 101,
      amount: 1200,
      type: 'Rent',
      date: new Date(2023, 5, 1).toISOString(),
      status: 'Paid',
      tenantName: 'John Tenant',
      unitNumber: 'Unit 101'
    },
    {
      id: 2,
      tenantId: 1,
      propertyId: 1,
      unitId: 101,
      amount: 1200,
      type: 'Rent',
      date: new Date(2023, 6, 1).toISOString(),
      status: 'Paid',
      tenantName: 'John Tenant',
      unitNumber: 'Unit 101'
    },
    {
      id: 3,
      tenantId: 1,
      propertyId: 1,
      unitId: 101,
      amount: 50,
      type: 'Late Fee',
      date: new Date(2023, 6, 5).toISOString(),
      status: 'Paid',
      tenantName: 'John Tenant',
      unitNumber: 'Unit 101'
    },
    {
      id: 4,
      tenantId: 3,
      propertyId: 1,
      unitId: 102,
      amount: 1150,
      type: 'Rent',
      date: new Date(2023, 6, 1).toISOString(),
      status: 'Paid',
      tenantName: 'Sarah Johnson',
      unitNumber: 'Unit 102'
    }
  ];

  constructor(private http: HttpClient) { }

   async ngOnInit() {
    debugger
    this.stripe = await loadStripe('pk_test_51S8WkJPZH47YlnBuLzF9ZRNkHbmOddKvxpYUhmFmEqhfLDgcowV11vRzdk0Kc7CgQ3k1GbPkN9zpNprteccso1fI00qCx4TO6t'); // Replace with your key
    const elements = this.stripe?.elements();
    this.cardElement = elements?.create('card');
    this.cardElement?.mount('#card-element'); // Mount to a div in your template
  }
  // Mock implementations
  getPayments(): Observable<Payment[]> {
    return of(this.mockPayments).pipe(delay(500));
  }

  getPayment(id: number): Observable<Payment> {
    const payment = this.mockPayments.find(p => p.id === id);
    return of(payment as Payment).pipe(delay(300));
  }

  getPaymentsByTenant(tenantId: number): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/bytenant/${tenantId}`);
  }

  getPaymentsByProperty(propertyId: number): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/byproperty/${propertyId}`);
  }

  createPayment(payment: Payment): Observable<Payment> {
    const newPayment = {
      ...payment,
      id: Math.max(...this.mockPayments.map(p => p.id || 0)) + 1,
      date: new Date().toISOString(),
      status: 'Paid'
    };
   // this.handleSubmit();
    return this.http.post<Payment>(this.apiUrl, payment);
  }

  updatePayment(id: number, payment: Payment): Observable<any> {
    const index = this.mockPayments.findIndex(p => p.id === id);
    if (index !== -1) {
      this.mockPayments[index] = { ...this.mockPayments[index], ...payment };
    }
    return of({ success: true }).pipe(delay(500));
  }

  deletePayment(id: number): Observable<any> {
    this.mockPayments = this.mockPayments.filter(p => p.id !== id);
    return of({ success: true }).pipe(delay(500));
  }

  async handleSubmit() {
    // 1. Call backend to create PaymentIntent
    const response = await this.http.post<{ clientSecret: string }>(
      `${this.apiUrl}/create-payment-intent`,
      new PaymentBody(1000, 'usd')
    ).toPromise();
    const clientSecret = response?.clientSecret;
    if (!clientSecret) {
      console.error('PaymentIntent clientSecret is undefined.');
      return;
    }
    debugger
    // 2. Confirm payment on the client-side
    const result = await this.stripe?.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: this.cardElement,
        },
      }
    );

    const paymentIntent = result?.paymentIntent;
    const error = result?.error;

    if (error) {
      console.error(error);
      // Display error to user
    } else if (paymentIntent?.status === 'succeeded') {
      console.log('Payment succeeded!', paymentIntent);
      // Display success to user
    }
  }
}
