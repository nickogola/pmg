import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LeaseService } from './lease.service';
import { Lease } from '../models/lease';

describe('LeaseService', () => {
  let service: LeaseService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LeaseService]
    });
    service = TestBed.inject(LeaseService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getLeases', () => {
    it('should return expected leases', () => {
      const mockLeases: Lease[] = [
        { 
          id: 1, 
          unitId: 101, 
          tenantId: 201, 
          startDate: '2023-01-01', 
          endDate: '2023-12-31', 
          monthlyRent: 1200, 
          securityDeposit: 1200, 
          isActive: true 
        },
        { 
          id: 2, 
          unitId: 102, 
          tenantId: 202, 
          startDate: '2023-02-01', 
          endDate: '2024-01-31', 
          monthlyRent: 1500, 
          securityDeposit: 1500, 
          isActive: true 
        }
      ];

      service.getLeases().subscribe(leases => {
        expect(leases).toEqual(mockLeases);
      });

      const req = httpTestingController.expectOne('/api/leases');
      expect(req.request.method).toEqual('GET');
      req.flush(mockLeases);
    });
  });

  describe('getLease', () => {
    it('should return expected lease', () => {
      const mockLease: Lease = { 
        id: 1, 
        unitId: 101, 
        tenantId: 201, 
        startDate: '2023-01-01', 
        endDate: '2023-12-31', 
        monthlyRent: 1200, 
        securityDeposit: 1200, 
        isActive: true 
      };

      service.getLease(1).subscribe(lease => {
        expect(lease).toEqual(mockLease);
      });

      const req = httpTestingController.expectOne('/api/leases/1');
      expect(req.request.method).toEqual('GET');
      req.flush(mockLease);
    });
  });

  describe('createLease', () => {
    it('should create a lease', () => {
      const newLease: Lease = { 
        unitId: 101, 
        tenantId: 201, 
        startDate: '2023-01-01', 
        endDate: '2023-12-31', 
        monthlyRent: 1200, 
        securityDeposit: 1200, 
        isActive: true 
      };
      
      const mockResponse: Lease = { 
        id: 1, 
        ...newLease 
      };

      service.createLease(newLease).subscribe(lease => {
        expect(lease).toEqual(mockResponse);
      });

      const req = httpTestingController.expectOne('/api/leases');
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(newLease);
      req.flush(mockResponse);
    });
  });

  describe('updateLease', () => {
    it('should update a lease', () => {
      const updateLease: Lease = { 
        id: 1, 
        unitId: 101, 
        tenantId: 201, 
        startDate: '2023-01-01', 
        endDate: '2024-12-31', // Updated end date
        monthlyRent: 1300, // Updated monthly rent
        securityDeposit: 1200, 
        isActive: true 
      };

      service.updateLease(1, updateLease).subscribe(lease => {
        expect(lease).toEqual(updateLease);
      });

      const req = httpTestingController.expectOne('/api/leases/1');
      expect(req.request.method).toEqual('PUT');
      expect(req.request.body).toEqual(updateLease);
      req.flush(updateLease);
    });
  });

  describe('terminateLease', () => {
    it('should terminate a lease', () => {
      const mockResponse = { success: true };

      service.terminateLease(1).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpTestingController.expectOne('/api/leases/1/terminate');
      expect(req.request.method).toEqual('PATCH');
      req.flush(mockResponse);
    });
  });

  describe('deleteLease', () => {
    it('should delete a lease', () => {
      const mockResponse = { success: true };

      service.deleteLease(1).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpTestingController.expectOne('/api/leases/1');
      expect(req.request.method).toEqual('DELETE');
      req.flush(mockResponse);
    });
  });
});
