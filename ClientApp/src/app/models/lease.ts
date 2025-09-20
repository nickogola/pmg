export interface Lease {
  leaseId: number;
  unitId: number;
  tenantId: number;
  startDate: Date;
  endDate: Date;
  monthlyRent: number;
  securityDeposit: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  
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
