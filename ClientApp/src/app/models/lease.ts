export interface Lease {
  id?: number;
  leaseId?: number;
  unitId: number;
  tenantId: number;
  startDate: string | Date;
  endDate: string | Date;
  monthlyRent: number;
  securityDeposit: number;
  isActive: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  
  // Navigation properties
  unit?: any;
  tenant?: any;
  payments?: any[];
  
  // UI helper properties
  unitNumber?: string;
  tenantName?: string;
  propertyName?: string;
  propertyId?: number; // Used for filtering units by property
  status?: string; // 'Active' | 'Expired' | 'Upcoming'
  daysRemaining?: number;
}
