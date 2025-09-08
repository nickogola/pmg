import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImagePlaceholderService {
  /**
   * Generate a placeholder image URL using placeholder.com
   * This can be used during development until real images are available
   *
   * @param width Width of the image
   * @param height Height of the image
   * @param text Optional text to display on the image
   * @param backgroundColor Background color (hex without #)
   * @param textColor Text color (hex without #)
   * @returns URL for the placeholder image
   */
  generatePlaceholder(
    width: number,
    height: number,
    text: string = '',
    backgroundColor: string = '0D6EFD',
    textColor: string = 'FFFFFF'
  ): string {
    if (text) {
      return `https://via.placeholder.com/${width}x${height}/${backgroundColor}/${textColor}?text=${encodeURIComponent(text)}`;
    }
    return `https://via.placeholder.com/${width}x${height}/${backgroundColor}/${textColor}`;
  }
  
  /**
   * Generate a list of placeholder image URLs for carousel
   * This should be replaced with actual image paths once available
   */
  generateCarouselPlaceholders(): string[] {
    const texts = [
      'Happy Tenants',
      'Modern Building',
      'Maintenance Team',
      'Online Payments',
      'Family Home'
    ];
    
    return texts.map(text => 
      this.generatePlaceholder(1600, 900, text)
    );
  }
  
  /**
   * Generate a list of placeholder image URLs for testimonial avatars
   * This should be replaced with actual image paths once available
   */
  generateTestimonialPlaceholders(): string[] {
    return Array(3).fill(0).map((_, i) => 
      this.generatePlaceholder(400, 400, `Tenant ${i + 1}`, '6C757D', 'FFFFFF')
    );
  }
}
