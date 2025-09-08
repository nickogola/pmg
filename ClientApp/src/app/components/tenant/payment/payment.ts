import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PaymentService } from '../../../services/payment';
import { Auth } from '../../../services/auth';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './payment.html',
  styleUrl: './payment.scss'
})
export class Payment implements OnInit {
  paymentForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  paymentAmount = 1200.00; // Default amount for rent
  paymentMethods = [
    { id: 'creditCard', name: 'Credit Card' },
    { id: 'bankTransfer', name: 'Bank Transfer' },
    { id: 'paypal', name: 'PayPal' }
  ];
  paymentTypes = [
    { id: 'Rent', name: 'Monthly Rent' },
    { id: 'LateFee', name: 'Late Fee Payment' },
    { id: 'Deposit', name: 'Security Deposit' },
    { id: 'Other', name: 'Other Payment' }
  ];
  pastPayments: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private paymentService: PaymentService,
    private authService: Auth,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.paymentForm = this.formBuilder.group({
      paymentType: ['Rent', Validators.required],
      amount: [this.paymentAmount, [Validators.required, Validators.min(0.01)]],
      paymentMethod: ['creditCard', Validators.required],
      cardNumber: ['', [
        Validators.required, 
        Validators.pattern(/^[0-9]{16}$/)
      ]],
      cardExpiry: ['', [
        Validators.required, 
        Validators.pattern(/^(0[1-9]|1[0-2])\/[0-9]{2}$/)
      ]],
      cardCvc: ['', [
        Validators.required, 
        Validators.pattern(/^[0-9]{3,4}$/)
      ]],
      savePaymentMethod: [false]
    });

    // Load payment history for this tenant
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      const userId = currentUser.userId || currentUser.id;
      if (userId) {
        this.loadPaymentHistory(userId);
      }
    }

    // Watch for payment type changes
    this.paymentForm.get('paymentType')?.valueChanges.subscribe(type => {
      if (type === 'Rent') {
        this.paymentAmount = 1200.00;
      } else if (type === 'LateFee') {
        this.paymentAmount = 50.00;
      } else if (type === 'Deposit') {
        this.paymentAmount = 1200.00;
      } else {
        this.paymentAmount = 0.00;
      }
      this.paymentForm.patchValue({ amount: this.paymentAmount });
    });
  }

  loadPaymentHistory(tenantId: number): void {
    this.paymentService.getPaymentsByTenant(tenantId).subscribe(payments => {
      this.pastPayments = payments;
    });
  }

  // Getters for form controls
  get paymentType() { return this.paymentForm.get('paymentType'); }
  get amount() { return this.paymentForm.get('amount'); }
  get paymentMethod() { return this.paymentForm.get('paymentMethod'); }
  get cardNumber() { return this.paymentForm.get('cardNumber'); }
  get cardExpiry() { return this.paymentForm.get('cardExpiry'); }
  get cardCvc() { return this.paymentForm.get('cardCvc'); }

  onSubmit(): void {
    if (this.paymentForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const currentUser = this.authService.currentUserValue;
    if (!currentUser) {
      this.errorMessage = 'You must be logged in to make a payment.';
      this.isSubmitting = false;
      return;
    }

    const paymentData = {
      tenantId: currentUser.userId || currentUser.id,
      unitId: currentUser.unitId || 101, // Fallback to mock data
      propertyId: currentUser.propertyId || 1, // Fallback to mock data
      amount: this.paymentForm.value.amount,
      paymentType: this.paymentForm.value.paymentType,
      paymentMethod: this.paymentForm.value.paymentMethod,
      date: new Date().toISOString(),
      status: 'Paid'
    };

    // In a real app, this would make a payment with a payment processor first
    // Then record the payment after successful transaction
    setTimeout(() => {
      this.paymentService.createPayment(paymentData).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.successMessage = 'Payment processed successfully!';
          this.paymentForm.reset({
            paymentType: 'Rent',
            amount: this.paymentAmount,
            paymentMethod: 'creditCard',
            savePaymentMethod: false
          });
          
          // Reload payment history
          const userId = currentUser.userId || currentUser.id;
          if (userId) {
            this.loadPaymentHistory(userId);
          }
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorMessage = 'Failed to process payment. Please try again.';
          console.error('Error processing payment:', error);
        }
      });
    }, 1500); // Simulate payment processing delay
  }
}
