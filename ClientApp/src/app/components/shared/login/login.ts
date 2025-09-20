import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../../services/auth';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  standalone: true
})
export class Login {
  loginForm: FormGroup;
  isLoading = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: Auth,
    private router: Router
  ) {
    // Initialize form with remember me checkbox
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
    
    // Check if we have stored credentials
    this.checkStoredCredentials();
  }

  // Getter methods for form controls
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
  get rememberMe() { return this.loginForm.get('rememberMe'); }
  
  // Check for stored credentials on component initialization
  private checkStoredCredentials(): void {
    const storedEmail = localStorage.getItem('rememberedEmail');
    if (storedEmail) {
      this.loginForm.patchValue({
        email: storedEmail,
        rememberMe: true
      });
    }
  }

  // Clear any validation errors and API error messages
  clearErrors(): void {
    this.error = '';
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.error = '';

    const { email, password, rememberMe } = this.loginForm.value;

    // Handle remember me functionality
    if (rememberMe) {
      localStorage.setItem('rememberedEmail', email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }

    this.authService.login(email, password).subscribe({
      next: (user) => {
        this.isLoading = false;
        
        // Navigate based on user type
        if (user.userType.toLowerCase() === 'tenant') {
          this.router.navigate(['/tenant/dashboard']);
        } else if (user.userType.toLowerCase() === 'admin' || user.userType.toLowerCase() === 'landlord') {
          this.router.navigate(['/admin/dashboard']);
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.error = 'Invalid email or password. Please try again.';
        console.error('Login error:', error);
      }
    });
  }
}
