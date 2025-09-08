import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentReports } from './payment-reports';

describe('PaymentReports', () => {
  let component: PaymentReports;
  let fixture: ComponentFixture<PaymentReports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentReports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentReports);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
