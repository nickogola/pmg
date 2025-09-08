export interface User {
  id?: number;
  userId?: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  password?: string; // For client-side form handling only
  passwordHash?: string;
  salt?: string;
  userType: string; // 'Tenant' | 'Landlord' | 'Admin'
  status?: string; // 'Current' | 'Former' | 'Applicant'
  createdAt?: Date;
  updatedAt?: Date;
  propertyId?: number;
  unitId?: number | null;
  moveInDate?: Date | string;
  moveOutDate?: Date | string;
  leaseEnd?: Date | string;
  leaseStart?: Date | string;
  balance?: number;
  notes?: string;
}
