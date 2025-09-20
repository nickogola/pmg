export interface Payment {
  id?: number;
  paymentId?: number;
  leaseId?: number;
  tenantId?: number;
  propertyId?: number;
  unitId?: number;
  amount: number;
  date?: string | Date;
  paymentDate?: string | Date;
  type?: string; // 'Rent' | 'Late Fee' | 'Deposit' | 'Other'
  paymentType?: string; // 'Rent' | 'LateFee' | 'Deposit' | 'Other'
  paymentMethod?: string; // 'CreditCard' | 'BankTransfer' | 'Cash' | 'Check'
  transactionId?: string;
  notes?: string;
  status?: string; // 'Paid' | 'Pending' | 'Failed'
  createdAt?: string | Date;
  lease?: any;
  tenantName?: string;
  unitNumber?: string;
}

export class PaymentBody {
  amount?: number;
  currency?: string;
  
   constructor(amount: number, currency: string) {
    this.amount = amount;
    this.currency = currency;
  }
}