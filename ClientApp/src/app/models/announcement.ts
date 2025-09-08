export interface Announcement {
  announcementId?: number;
  propertyId?: number;
  title: string;
  content: string;
  issuedBy: number;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  property?: any;
  issuer?: any;
}
