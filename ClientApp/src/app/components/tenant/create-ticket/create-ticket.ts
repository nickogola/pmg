import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TicketService } from '../../../services/ticket';
import { Auth } from '../../../services/auth';

@Component({
  selector: 'app-create-ticket',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create-ticket.html',
  styleUrl: './create-ticket.scss'
})
export class CreateTicket implements OnInit {
  ticketForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  categories = [
    'Plumbing',
    'Electrical',
    'HVAC',
    'Appliances',
    'Structural',
    'Pest Control',
    'Landscaping',
    'Security',
    'Keys/Access',
    'Other'
  ];

  constructor(
    private formBuilder: FormBuilder,
    private ticketService: TicketService,
    private authService: Auth,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.ticketForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', Validators.required],
      priority: ['Medium', Validators.required]
    });
  }

  // Getters for form controls
  get title() { return this.ticketForm.get('title'); }
  get description() { return this.ticketForm.get('description'); }
  get category() { return this.ticketForm.get('category'); }
  get priority() { return this.ticketForm.get('priority'); }

  onSubmit(): void {
    if (this.ticketForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const currentUser = this.authService.currentUserValue;
    if (!currentUser) {
      this.errorMessage = 'You must be logged in to create a ticket.';
      this.isSubmitting = false;
      return;
    }

    const ticketData = {
      ...this.ticketForm.value,
      tenantId: currentUser.userId || currentUser.id,
      unitId: currentUser.unitId || 1, // Fallback to mock data
      propertyId: currentUser.propertyId || 1, // Fallback to mock data
      status: 'New'
    };

    this.ticketService.createTicket(ticketData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/tenant/dashboard']);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = 'Failed to create ticket. Please try again.';
        console.error('Error creating ticket:', error);
      }
    });
  }
}
