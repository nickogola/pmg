import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Lease } from '../../../models/lease';
import { LeaseService } from '../../../services/lease.service';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-admin-leases',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, HttpClientModule],
  templateUrl: './leases.html',
  styleUrls: ['./leases.scss']
})
export class AdminLeasesComponent implements OnInit {
  leases: Lease[] = [];
  filteredLeases: Lease[] = [];
  selectedLease: Lease | null = null;
  showDetails: boolean = false;
  filterText: string = '';
  statusFilter: string = 'all';
  loading: boolean = false;
  error: string = '';

  // Add/Edit Form Properties
  leaseForm!: FormGroup;
  showLeaseForm: boolean = false;
  isEditMode: boolean = false;
  formSubmitting: boolean = false;
  
  // Form data
  properties: any[] = [];
  availableUnits: any[] = [];
  tenants: any[] = [];

  constructor(
    private leaseService: LeaseService, 
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.initLeaseForm();
    this.loadLeases();
    this.loadFormData();
  }

  loadLeases(): void {
    this.leaseService.getLeases().subscribe({
      next: (data: Lease[]) => {
        this.leases = data;
        this.processLeases();
        this.applyFilters();
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error fetching leases:', error);
        this.error = 'Failed to load leases. Please try again later.';
        this.loading = false;
      }
    });
  }
  
  initLeaseForm(): void {
    this.leaseForm = this.fb.group({
      id: [null],
      propertyId: ['', Validators.required],
      unitId: ['', Validators.required],
      tenantId: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      monthlyRent: ['', [Validators.required, Validators.min(0)]],
      securityDeposit: ['', [Validators.required, Validators.min(0)]],
      isActive: [true]
    }, { validators: this.dateRangeValidator });
  }
  
  dateRangeValidator(control: AbstractControl): ValidationErrors | null {
    const startDate = control.get('startDate')?.value;
    const endDate = control.get('endDate')?.value;
    
    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      return { endDateBeforeStart: true };
    }
    
    return null;
  }
  
  loadFormData(): void {
    // Mock data - in a real app, these would come from API calls
    this.properties = [
      { id: 1, name: 'Sunset Apartments' },
      { id: 2, name: 'Ocean View Condos' },
      { id: 3, name: 'Mountain Retreat' }
    ];
    
    this.availableUnits = [
      { id: 101, propertyId: 1, unitNumber: 'A101' },
      { id: 102, propertyId: 1, unitNumber: 'A102' },
      { id: 103, propertyId: 1, unitNumber: 'A103' },
      { id: 201, propertyId: 2, unitNumber: 'B201' },
      { id: 202, propertyId: 2, unitNumber: 'B202' },
      { id: 301, propertyId: 3, unitNumber: 'C301' }
    ];
    
    this.tenants = [
      { id: 1, firstName: 'John', lastName: 'Doe' },
      { id: 2, firstName: 'Jane', lastName: 'Smith' },
      { id: 3, firstName: 'Robert', lastName: 'Johnson' },
      { id: 4, firstName: 'Emily', lastName: 'Williams' }
    ];
  }

  processLeases(): void {
    const now = new Date();
    
    this.leases.forEach(lease => {
      // Set lease status
      const startDate = new Date(lease.startDate);
      const endDate = new Date(lease.endDate);
      
      if (now < startDate) {
        lease.status = 'Upcoming';
      } else if (now > endDate) {
        lease.status = 'Expired';
      } else {
        lease.status = 'Active';
      }
      
      // Calculate days remaining (if active)
      if (lease.status === 'Active') {
        const diffTime = Math.abs(endDate.getTime() - now.getTime());
        lease.daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }
    });
  }

  applyFilters(): void {
    this.filteredLeases = this.leases.filter(lease => {
      // Text filter
      const matchesText = this.filterText === '' || 
        (lease.tenantName && lease.tenantName.toLowerCase().includes(this.filterText.toLowerCase())) ||
        (lease.unitNumber && lease.unitNumber.toLowerCase().includes(this.filterText.toLowerCase())) ||
        (lease.propertyName && lease.propertyName.toLowerCase().includes(this.filterText.toLowerCase()));
      
      // Status filter
      const matchesStatus = this.statusFilter === 'all' || lease.status === this.statusFilter;
      
      return matchesText && matchesStatus;
    });
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  viewLeaseDetails(lease: Lease): void {
    this.selectedLease = lease;
    this.showDetails = true;
  }

  closeDetails(): void {
    this.showDetails = false;
  }

  addNewLease(): void {
    this.isEditMode = false;
    this.leaseForm.reset({
      isActive: true
    });
    this.showLeaseForm = true;
  }

  editLease(lease: Lease): void {
    this.isEditMode = true;
    
    // Filter units by property
    if (lease.propertyId) {
      this.onPropertySelected(lease.propertyId);
    }
    
    // Prepare dates for form
    const startDate = lease.startDate ? new Date(lease.startDate).toISOString().split('T')[0] : '';
    const endDate = lease.endDate ? new Date(lease.endDate).toISOString().split('T')[0] : '';
    
    this.leaseForm.patchValue({
      id: lease.id,
      propertyId: lease.propertyId?.toString() || '',
      unitId: lease.unitId?.toString() || '',
      tenantId: lease.tenantId?.toString() || '',
      startDate: startDate,
      endDate: endDate,
      monthlyRent: lease.monthlyRent,
      securityDeposit: lease.securityDeposit,
      isActive: lease.isActive
    });
    
    this.showLeaseForm = true;
  }
  
  cancelLeaseForm(): void {
    this.showLeaseForm = false;
  }
  
  submitLeaseForm(): void {
    if (this.leaseForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.leaseForm.controls).forEach(key => {
        const control = this.leaseForm.get(key);
        control?.markAsTouched();
      });
      return;
    }
    
    this.formSubmitting = true;
    const formValue = this.leaseForm.value;
    
    // Convert form values
    const leaseData: Lease = {
      ...formValue,
      unitId: parseInt(formValue.unitId, 10),
      tenantId: parseInt(formValue.tenantId, 10),
      monthlyRent: parseFloat(formValue.monthlyRent),
      securityDeposit: parseFloat(formValue.securityDeposit)
    };
    
    // Remove propertyId as it's not part of the Lease model (just used for unit selection)
    delete leaseData.propertyId;
    
    if (this.isEditMode && leaseData.id) {
      // Update existing lease
      this.leaseService.updateLease(leaseData.id, leaseData).subscribe({
        next: (updatedLease) => {
          this.handleFormSuccess('Lease updated successfully');
          // Update lease in list
          const index = this.leases.findIndex(l => l.id === updatedLease.id);
          if (index !== -1) {
            this.leases[index] = { ...this.leases[index], ...updatedLease };
            this.processLeases();
            this.applyFilters();
          }
        },
        error: (error: any) => {
          this.handleFormError('Failed to update lease', error);
        }
      });
    } else {
      // Create new lease
      this.leaseService.createLease(leaseData).subscribe({
        next: (newLease) => {
          this.handleFormSuccess('Lease created successfully');
          // Add new lease to list
          this.leases.push(newLease);
          this.processLeases();
          this.applyFilters();
        },
        error: (error: any) => {
          this.handleFormError('Failed to create lease', error);
        }
      });
    }
  }
  
  handleFormSuccess(message: string): void {
    this.formSubmitting = false;
    this.showLeaseForm = false;
    // Here you could add a success notification
    console.log(message);
  }
  
  handleFormError(message: string, error: any): void {
    this.formSubmitting = false;
    console.error(message, error);
    // Here you could add an error notification
  }
  
  onPropertyChange(): void {
    const propertyId = this.leaseForm.get('propertyId')?.value;
    if (propertyId) {
      this.onPropertySelected(parseInt(propertyId, 10));
    } else {
      this.availableUnits = [];
      this.leaseForm.get('unitId')?.setValue('');
    }
  }
  
  onPropertySelected(propertyId: number): void {
    // Filter units by selected property
    this.availableUnits = this.availableUnits.filter(unit => unit.propertyId === propertyId);
  }

  terminateLease(lease: Lease): void {
    if (confirm('Are you sure you want to terminate this lease? This action cannot be undone.')) {
      this.leaseService.terminateLease(lease.id!).subscribe({
        next: () => {
          // Update lease status
          lease.isActive = false;
          lease.status = 'Expired';
          this.applyFilters();
        },
        error: (error: any) => {
          console.error('Error terminating lease:', error);
        }
      });
    }
  }

  renewLease(lease: Lease): void {
    // Placeholder for renew lease functionality
    console.log('Renew lease clicked:', lease);
  }

  formatCurrency(amount: number): string {
    return amount ? `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '$0.00';
  }

  formatDate(date: string | Date): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
