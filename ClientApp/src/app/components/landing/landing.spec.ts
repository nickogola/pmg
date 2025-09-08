import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LandingComponent } from './landing';

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingComponent, RouterTestingModule]
    }).compileComponents();
    
    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have carousel images', () => {
    expect(component.carouselImages.length).toBeGreaterThan(0);
  });

  it('should have testimonials', () => {
    expect(component.testimonials.length).toBeGreaterThan(0);
  });

  it('should have features', () => {
    expect(component.features.length).toBeGreaterThan(0);
  });

  it('should initialize carousel index to 0', () => {
    expect(component.currentCarouselIndex).toBe(0);
  });

  it('should set carousel index', () => {
    component.setCarouselIndex(2);
    expect(component.currentCarouselIndex).toBe(2);
  });
});
