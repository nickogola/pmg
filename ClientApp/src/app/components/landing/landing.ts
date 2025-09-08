import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ImagePlaceholderService } from '../../services/utils/image-placeholder.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './landing.html',
  styleUrls: ['./landing.scss']
})
export class LandingComponent implements OnInit {
  // Properties for carousel
  carouselImages = [
    {
      // For development, we use placeholders. Replace with actual images in production.
      url: 'https://via.placeholder.com/1600x900/0D6EFD/FFFFFF?text=Happy+Tenants',
      alt: 'Happy tenants moving into new apartment',
      caption: 'Start your journey with hassle-free property management'
    },
    {
      url: 'https://via.placeholder.com/1600x900/0D6EFD/FFFFFF?text=Modern+Building',
      alt: 'Modern apartment building exterior',
      caption: 'Beautiful properties maintained to the highest standards'
    },
    {
      url: 'https://via.placeholder.com/1600x900/0D6EFD/FFFFFF?text=Maintenance+Team',
      alt: 'Maintenance team fixing issues',
      caption: 'Quick response times for all maintenance requests'
    },
    {
      url: 'https://via.placeholder.com/1600x900/0D6EFD/FFFFFF?text=Online+Payments',
      alt: 'Tenant using laptop for online payment',
      caption: 'Simple online payments for rent and utilities'
    },
    {
      url: 'https://via.placeholder.com/1600x900/0D6EFD/FFFFFF?text=Happy+Family',
      alt: 'Happy family in their apartment',
      caption: 'Creating happy homes for families and individuals'
    }
  ];

  // Testimonials from happy tenants
  testimonials = [
    {
      name: 'Sarah Johnson',
      // For development, we use placeholders. Replace with actual images in production.
      image: 'https://via.placeholder.com/400x400/6C757D/FFFFFF?text=Sarah+J',
      position: 'Tenant since 2022',
      quote: 'The maintenance request system is incredible! I had a leaky faucet and it was fixed the same day I reported it.'
    },
    {
      name: 'Michael Chen',
      image: 'https://via.placeholder.com/400x400/6C757D/FFFFFF?text=Michael+C',
      position: 'Tenant since 2021',
      quote: 'Paying rent online is so convenient. I love getting the automatic receipts and never having to worry about late payments.'
    },
    {
      name: 'Emma Rodriguez',
      image: 'https://via.placeholder.com/400x400/6C757D/FFFFFF?text=Emma+R',
      position: 'Tenant since 2023',
      quote: 'As a busy professional, I appreciate how responsive the property management team is to all my questions and concerns.'
    }
  ];

  // Property features
  features = [
    {
      icon: 'home_repair_service',
      title: 'Maintenance Requests',
      description: 'Submit and track maintenance requests with our simple ticketing system'
    },
    {
      icon: 'payments',
      title: 'Online Payments',
      description: 'Pay rent securely online and get instant payment confirmations'
    },
    {
      icon: 'forum',
      title: 'Communication',
      description: 'Stay updated with important announcements from property management'
    },
    {
      icon: 'description',
      title: 'Document Access',
      description: 'Access important documents and lease information anytime'
    }
  ];

  // Current carousel index
  currentCarouselIndex = 0;
  
  constructor() { }
  
  ngOnInit(): void {
    this.startCarousel();
  }
  
  startCarousel(): void {
    setInterval(() => {
      this.currentCarouselIndex = (this.currentCarouselIndex + 1) % this.carouselImages.length;
    }, 5000); // Rotate every 5 seconds
  }

  setCarouselIndex(index: number): void {
    this.currentCarouselIndex = index;
  }
}
