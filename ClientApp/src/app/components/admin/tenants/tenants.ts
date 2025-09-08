import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { User } from '../../../models/user';
import { Auth } from '../../../services/auth';

@Component({
  selector: 'app-tenants',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './tenants.html',
  styleUrl: './tenants.scss'
})
export class Tenants implements OnInit {
  tenants: User[] = [];
  filteredTenants: User[] = [];
  isLoading = true;
  searchTerm = '';
  propertyFilter = 'all';
  statusFilter = 'all';
  
  selectedTenant: User | null = null;
  showDetailsPanel = false;
  
  // Mock properties for demo
  properties = [
    { id: 1, name: 'Sunset Apartments' },
    { id: 2, name: 'Oakwood Residences' }
  ];
  
  // Mock units by property for demo
  unitsByProperty = {
    1: [
      { id: 101, number: '101', tenantId: 1 },
      { id: 102, number: '102', tenantId: 3 },
      { id: 103, number: '103', tenantId: null }
    ],
    2: [
      { id: 201, number: '201', tenantId: null },
      { id: 202, number: '202', tenantId: null }
    ]
  };
  
  constructor(private authService: Auth) {}
  
  ngOnInit(): void {
    this.loadTenants();
  }
  
  loadTenants(): void {
    this.isLoading = true;
    
    // In a real application, you would fetch this from a backend service
    // For now, we'll use the mock user from our Auth service and add some more
    const mockTenants: User[] = [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Tenant',
        email: 'tenant@example.com',
        userType: 'Tenant',
        phoneNumber: '123-456-7890',
        propertyId: 1,
        unitId: 101,
        moveInDate: new Date(2023, 0, 15),
        leaseEnd: new Date(2024, 0, 14)
      },
      {
        id: 3,
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah@example.com',
        userType: 'Tenant',
        phoneNumber: '123-456-7892',
        propertyId: 1,
        unitId: 102,
        moveInDate: new Date(2023, 3, 1),
        leaseEnd: new Date(2024, 2, 31)
      },
      {
        id: 4,
        firstName: 'Michael',
        lastName: 'Smith',
        email: 'michael@example.com',
        userType: 'Tenant',
        phoneNumber: '123-456-7893',
        propertyId: 1,
        unitId: null,
        status: 'Former',
        moveInDate: new Date(2022, 1, 15),
        leaseEnd: new Date(2023, 1, 14),
        moveOutDate: new Date(2023, 1, 10)
      }
    ];
    
    setTimeout(() => {
      this.tenants = mockTenants;
      this.filteredTenants = [...mockTenants];
      this.isLoading = false;
    }, 800); // Simulate loading delay
  }
  
  applyFilters(): void {
    let filtered = [...this.tenants];
    
    // Apply property filter
    if (this.propertyFilter !== 'all') {
      const propertyId = Number(this.propertyFilter);
      filtered = filtered.filter(t => t.propertyId === propertyId);
    }
    
    // Apply status filter
    if (this.statusFilter !== 'all') {
      if (this.statusFilter === 'current') {
        filtered = filtered.filter(t => !t.status || t.status === 'Current');
      } else {
        filtered = filtered.filter(t => t.status === this.statusFilter);
      }
    }
    
    // Apply search term
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(t => 
        t.firstName.toLowerCase().includes(searchLower) ||
        t.lastName.toLowerCase().includes(searchLower) ||
        t.email.toLowerCase().includes(searchLower) ||
        t.phoneNumber?.includes(searchLower) ||
        this.getUnitNumber(t).toLowerCase().includes(searchLower)
      );
    }
    
    this.filteredTenants = filtered;
  }
  
  selectTenant(tenant: User): void {
    this.selectedTenant = tenant;
    this.showDetailsPanel = true;
  }
  
  closeDetails(): void {
    this.showDetailsPanel = false;
    setTimeout(() => {
      this.selectedTenant = null;
    }, 300); // Small delay for animation
  }
  
  getPropertyName(propertyId: number | undefined): string {
    if (!propertyId) return 'No Property';
    const property = this.properties.find(p => p.id === propertyId);
    return property ? property.name : `Property ${propertyId}`;
  }
  
  getUnitNumber(tenant: User): string {
    if (!tenant.unitId || !tenant.propertyId) return 'No Unit';
    
    const propertyUnits = this.unitsByProperty[tenant.propertyId as keyof typeof this.unitsByProperty];
    if (!propertyUnits) return `Unit ${tenant.unitId}`;
    
    const unit = propertyUnits.find(u => u.id === tenant.unitId);
    return unit ? `Unit ${unit.number}` : `Unit ${tenant.unitId}`;
  }
  
  getLeaseStatus(tenant: User): { text: string, class: string } {
    if (tenant.status === 'Former') {
      return { 
        text: 'Former Tenant', 
        class: 'bg-gray-100 text-gray-800' 
      };
    }
    
    const today = new Date();
    const leaseEnd = tenant.leaseEnd ? new Date(tenant.leaseEnd) : null;
    
    if (!leaseEnd) {
      return { 
        text: 'No Lease', 
        class: 'bg-yellow-100 text-yellow-800' 
      };
    }
    
    const daysLeft = Math.floor((leaseEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) {
      return { 
        text: 'Lease Expired', 
        class: 'bg-red-100 text-red-800' 
      };
    } else if (daysLeft <= 30) {
      return { 
        text: 'Expires Soon', 
        class: 'bg-yellow-100 text-yellow-800' 
      };
    } else {
      return { 
        text: 'Active', 
        class: 'bg-green-100 text-green-800' 
      };
    }
  }
  
  formatDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  }
}
