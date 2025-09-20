import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Auth } from '../../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HttpClientModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent implements OnInit {
  // Step management
  step = 1;
  
  // Form data
  registerForm!: FormGroup;
  
  // Form errors
  formErrors: { [key: string]: string } = {};
  
  // Registration process state
  isLoading = false;
  errorMessage: string | null = null;
  
  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private router: Router
  ) { }
  
  ngOnInit(): void {
    this.initializeForm();
  }
  
  initializeForm(): void {
    this.registerForm = this.fb.group({
      // Step 1: Account Info fields
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      userType: ['Tenant', Validators.required], // Default to Tenant
      
      // Step 2: Security fields
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }
  
  // Method to validate step 1
  validateStep1(): boolean {
    const controls = ['firstName', 'lastName', 'email', 'phoneNumber'];
    this.formErrors = {};
    
    let isValid = true;
    
    controls.forEach(control => {
      const value = this.registerForm.get(control)?.value;
      
      if (!value || (typeof value === 'string' && !value.trim())) {
        this.formErrors[control] = `${this.formatControlName(control)} is required`;
        isValid = false;
      }
    });
    
    // Validate email format
    if (this.registerForm.get('email')?.value && 
        !this.isValidEmail(this.registerForm.get('email')?.value)) {
      this.formErrors['email'] = 'Email is invalid';
      isValid = false;
    }
    
    return isValid;
  }
  
  // Method to validate step 2
  validateStep2(): boolean {
    const { password, confirmPassword } = this.registerForm.value;
    this.formErrors = {};
    
    let isValid = true;
    
    if (!password) {
      this.formErrors['password'] = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      this.formErrors['password'] = 'Password must be at least 6 characters';
      isValid = false;
    }
    
    if (!confirmPassword) {
      this.formErrors['confirmPassword'] = 'Please confirm your password';
      isValid = false;
    } else if (password !== confirmPassword) {
      this.formErrors['confirmPassword'] = 'Passwords do not match';
      isValid = false;
    }
    
    return isValid;
  }
  
  // Format control name for error messages
  formatControlName(control: string): string {
    return control
      .replace(/([A-Z])/g, ' $1') // Insert space before capital letters
      .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
  }
  
  // Validate email format
  isValidEmail(email: string): boolean {
    return /\S+@\S+\.\S+/.test(email);
  }
  
  // Handle next step button click
  handleNextStep(): void {
    if (this.validateStep1()) {
      this.step = 2;
    }
  }
  
  // Handle previous step button click
  handlePrevStep(): void {
    this.step = 1;
  }
  
  // Handle final form submission
  handleSubmit(): void {
    if (!this.validateStep2()) return;
    
    this.isLoading = true;
    this.errorMessage = null;
    
    // Remove confirmPassword before sending
    const { confirmPassword, ...userData } = this.registerForm.value;
    
    this.authService.register(userData).subscribe({
      next: (result) => {
        this.isLoading = false;
        
        // Redirect based on user type
        if (userData.userType === 'Tenant') {
          this.router.navigate(['/tenant/dashboard']);
        } else {
          this.router.navigate(['/admin/dashboard']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'An unexpected error occurred. Please try again.';
        console.error('Registration error:', err);
      }
    });
  }
}

