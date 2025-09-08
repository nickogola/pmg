import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Payment } from '../models/payment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'https://localhost:7225/api/payments';

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

  // Mock implementations
  getPayments(): Observable<Payment[]> {
    return of(this.mockPayments).pipe(delay(500));
  }

  getPayment(id: number): Observable<Payment> {
    const payment = this.mockPayments.find(p => p.id === id);
    return of(payment as Payment).pipe(delay(300));
  }

  getPaymentsByTenant(tenantId: number): Observable<Payment[]> {
    const payments = this.mockPayments.filter(p => p.tenantId === tenantId);
    return of(payments).pipe(delay(500));
  }

  getPaymentsByProperty(propertyId: number): Observable<Payment[]> {
    const payments = this.mockPayments.filter(p => p.propertyId === propertyId);
    return of(payments).pipe(delay(500));
  }

  createPayment(payment: Payment): Observable<Payment> {
    const newPayment = {
      ...payment,
      id: Math.max(...this.mockPayments.map(p => p.id || 0)) + 1,
      date: new Date().toISOString(),
      status: 'Paid'
    };
    this.mockPayments.push(newPayment);
    return of(newPayment).pipe(delay(700));
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
}
