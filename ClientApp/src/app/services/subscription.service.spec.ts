import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { SubscriptionService, SubscriptionPlan, SubscriptionRequest, SubscriptionResponse, UserSubscription } from './subscription.service';
import { environment } from '../../environments/environment';

describe('SubscriptionService', () => {
  let service: SubscriptionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SubscriptionService]
    });
    service = TestBed.inject(SubscriptionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get subscription plans', () => {
    const mockPlans: SubscriptionPlan[] = [
      {
        id: 'free',
        name: 'Free Plan',
        description: 'Basic plan',
        price: 0,
        billingPeriod: 'month',
        features: ['Feature 1', 'Feature 2']
      },
      {
        id: 'premium',
        name: 'Premium Plan',
        description: 'Advanced plan',
        price: 19.99,
        billingPeriod: 'month',
        features: ['Feature 1', 'Feature 2', 'Feature 3'],
        recommended: true
      }
    ];

    service.getPlans().subscribe(plans => {
      expect(plans).toEqual(mockPlans);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/subscriptions/plans`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPlans);
  });

  it('should get user subscription', () => {
    const userId = 'user123';
    const mockSubscription: UserSubscription = {
      id: 'sub123',
      userId: userId,
      planId: 'premium',
      planName: 'Premium Plan',
      status: 'active',
      startDate: '2023-01-01',
      endDate: '2024-01-01',
      currentPeriodStart: '2023-01-01',
      currentPeriodEnd: '2023-02-01',
      cancelAtPeriodEnd: false,
      amount: 19.99,
      interval: 'month'
    };

    service.getUserSubscription(userId).subscribe(subscription => {
      expect(subscription).toEqual(mockSubscription);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/subscriptions/user/${userId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockSubscription);
  });

  it('should create subscription', () => {
    const mockRequest: SubscriptionRequest = {
      userId: 'user123',
      planId: 'premium',
      planName: 'Premium Plan',
      amount: 19.99,
      interval: 'month'
    };

    const mockResponse: SubscriptionResponse = {
      subscriptionId: 'sub123',
      status: 'success',
      checkoutUrl: '/checkout/sub123',
      message: 'Subscription created successfully'
    };

    service.createSubscription(mockRequest).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/subscriptions`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRequest);
    req.flush(mockResponse);
  });

  it('should cancel subscription', () => {
    const subscriptionId = 'sub123';
    const mockResponse: SubscriptionResponse = {
      subscriptionId: subscriptionId,
      status: 'success',
      message: 'Subscription canceled successfully'
    };

    service.cancelSubscription(subscriptionId).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/subscriptions/${subscriptionId}/cancel`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should resume subscription', () => {
    const subscriptionId = 'sub123';
    const mockResponse: SubscriptionResponse = {
      subscriptionId: subscriptionId,
      status: 'success',
      message: 'Subscription resumed successfully'
    };

    service.resumeSubscription(subscriptionId).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/subscriptions/${subscriptionId}/resume`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should change subscription plan', () => {
    const subscriptionId = 'sub123';
    const newPlanId = 'premium-plus';
    const mockResponse: SubscriptionResponse = {
      subscriptionId: subscriptionId,
      status: 'success',
      message: 'Plan changed successfully'
    };

    service.changePlan(subscriptionId, newPlanId).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/subscriptions/${subscriptionId}/change-plan`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ newPlanId });
    req.flush(mockResponse);
  });

  it('should get invoices', () => {
    const userId = 'user123';
    const mockInvoices = [
      {
        id: 'inv1',
        userId: userId,
        subscriptionId: 'sub123',
        amount: 19.99,
        date: '2023-01-01',
        status: 'paid'
      },
      {
        id: 'inv2',
        userId: userId,
        subscriptionId: 'sub123',
        amount: 19.99,
        date: '2023-02-01',
        status: 'paid'
      }
    ];

    service.getInvoices(userId).subscribe(invoices => {
      expect(invoices).toEqual(mockInvoices);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/subscriptions/user/${userId}/invoices`);
    expect(req.request.method).toBe('GET');
    req.flush(mockInvoices);
  });
});
