export interface Ticket {
  id?: number;
  ticketId?: number;
  unitId: number;
  tenantId: number;
  propertyId?: number;
  title: string;
  description: string;
  category?: string; // 'Plumbing' | 'Electrical' | 'HVAC' | etc.
  priority: string; // 'Low' | 'Medium' | 'High' | 'Emergency'
  status: string; // 'Open' | 'In Progress' | 'Resolved' | 'Closed' | 'Denied'
  createdAt?: string | Date;
  updatedAt?: string | Date;
  resolvedAt?: string | Date;
  unit?: any;
  tenant?: any;
  tenantName?: string;
  comments?: TicketComment[];
}

export interface TicketComment {
  id?: number;
  commentId?: number;
  ticketId: number;
  userId: number;
  comment: string;
  createdAt?: string | Date;
  user?: any;
}
