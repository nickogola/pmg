import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Auth } from '../../../services/auth';
import { SubscriptionService } from '../../../services/subscription.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HttpClientModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent implements OnInit {
  // Wizard progress tracking
  currentStep = 1;
  totalSteps = 4;
  
  // Forms for different steps
  userTypeForm!: FormGroup<any>;
  accountDetailsForm!: FormGroup<any>;
  profileDetailsForm!: FormGroup<any>;
  subscriptionForm!: FormGroup<any>;
  
  // Selected user type (tenant or landlord)
  userType: 'tenant' | 'landlord' = 'tenant';
  
  // Subscription options for landlords
  subscriptionPlans = [
    {
      id: 'free',
      name: 'Free Plan',
      price: 0,
      billingPeriod: 'month',
      features: [
        'Add and manage tenants',
        'Send messages and announcements',
        'Basic property management',
      ],
      limitations: [
        'No online rent payments',
        'Limited to 5 units',
        'Basic reporting'
      ]
    },
    {
      id: 'premium-monthly',
      name: 'Premium Plan',
      price: 19.95,
      billingPeriod: 'month',
      features: [
        'Everything in Free Plan',
        'Collect rent online',
        'Unlimited units',
        'Advanced reporting and analytics',
        'Maintenance request tracking',
        'Document management',
        'Priority support'
      ],
      recommended: true
    },
    {
      id: 'premium-yearly',
      name: 'Premium Plan (Annual)',
      price: 180,
      billingPeriod: 'year',
      features: [
        'Everything in Monthly Premium Plan',
        'Save $59.40 per year (25% discount)'
      ]
    }
  ];
  
  // Selected subscription plan for landlords
  selectedPlan: string = 'free';
  
  // Registration process state
  isLoading = false;
  errorMessage: string | null = null;
  
  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private subscriptionService: SubscriptionService
  ) { }
  
  ngOnInit(): void {
    this.initializeForms();
  }
  
  initializeForms(): void {
    // Step 1: User Type Selection
    this.userTypeForm = this.fb.group({
      userType: ['tenant', Validators.required]
    });
    
    // Step 2: Account Details
    this.accountDetailsForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
    
    // Step 3: Profile Details
    this.profileDetailsForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      // Additional fields for landlords
      companyName: [''],
      address: this.fb.group({
        street: [''],
        city: [''],
        state: [''],
        zipCode: ['']
      })
    });
    
    // Step 4: Subscription (for landlords)
    this.subscriptionForm = this.fb.group({
      planId: ['free', Validators.required]
    });
    
    // React to user type changes
    this.userTypeForm.get('userType')?.valueChanges.subscribe(value => {
      this.userType = value;
      this.totalSteps = value === 'landlord' ? 4 : 3;
    });
  }
  
  passwordMatchValidator(formGroup: FormGroup<any>): { [key: string]: boolean } | null {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    
    if (password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      formGroup.get('confirmPassword')?.setErrors(null);
      return null;
    }
  }
  
  nextStep(): void {
    // Validate current step before proceeding
    if (this.currentStep === 1 && this.userTypeForm.valid) {
      this.currentStep++;
      this.userType = this.userTypeForm.get('userType')?.value;
    } 
    else if (this.currentStep === 2 && this.accountDetailsForm.valid) {
      this.currentStep++;
    } 
    else if (this.currentStep === 3 && this.profileDetailsForm.valid) {
      if (this.userType === 'landlord') {
        this.currentStep++;
      } else {
        this.submitRegistration();
      }
    } 
    else if (this.currentStep === 4 && this.subscriptionForm.valid) {
      this.submitRegistration();
    }
  }
  
  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
  
  selectPlan(planId: string): void {
    this.selectedPlan = planId;
    this.subscriptionForm.patchValue({
      planId: planId
    });
  }
  
  async submitRegistration(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = null;
    
    try {
      // Combine form data
      const registrationData = {
        userType: this.userTypeForm.get('userType')?.value,
        ...this.accountDetailsForm.value,
        ...this.profileDetailsForm.value,
        ...(this.userType === 'landlord' ? { subscriptionPlan: this.subscriptionForm.get('planId')?.value } : {})
      };
      
      // Register the user
      const registrationResult = await firstValueFrom(this.authService.register(registrationData));
      if (!registrationResult || !registrationResult.userId) {
        throw new Error('Registration failed');
      }
      
      // Process subscription if landlord with paid plan
      if (this.userType === 'landlord' && this.selectedPlan !== 'free') {
        const plan = this.subscriptionPlans.find(p => p.id === this.selectedPlan);
        
        // Redirect to Stripe checkout
        await firstValueFrom(this.subscriptionService.createSubscription({
          userId: registrationResult.userId.toString(),
          planId: this.selectedPlan,
          planName: plan?.name || '',
          amount: plan?.price || 0,
          interval: plan?.billingPeriod || 'month'
        }));
      } else {
        // Redirect to appropriate dashboard
        if (this.userType === 'landlord') {
          window.location.href = '/admin/dashboard';
        } else {
          window.location.href = '/tenant/dashboard';
        }
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      this.errorMessage = error.message || 'Failed to register. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }
}
