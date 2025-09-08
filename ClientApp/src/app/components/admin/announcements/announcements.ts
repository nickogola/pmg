import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AnnouncementService } from '../../../services/announcement';
import { Auth } from '../../../services/auth';
import { Announcement } from '../../../models/announcement';

@Component({
  selector: 'app-announcements',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './announcements.html',
  styleUrl: './announcements.scss'
})
export class Announcements implements OnInit {
  announcements: Announcement[] = [];
  filteredAnnouncements: Announcement[] = [];
  
  // Additional properties for UI functionality
  recipientType: 'all' | 'specific' = 'all';
  availableUnits: { id: number, unitNumber: string }[] = [];
  selectedUnitIds: number[] = [];
  
  newAnnouncement: Announcement = {
    title: '',
    content: '',
    issuedBy: 0,
    isActive: true,
    startDate: new Date()
  };
  
  selectedAnnouncement: Announcement | null = null;
  isLoading = true;
  isSaving = false;
  searchTerm = '';
  showNewAnnouncementForm = false;
  
  constructor(
    private announcementService: AnnouncementService,
    public authService: Auth
  ) {}
  
  ngOnInit(): void {
    this.loadAnnouncements();
    this.loadAvailableUnits();
  }
  
  loadAnnouncements(): void {
    this.isLoading = true;
    this.announcementService.getAnnouncements().subscribe({
      next: (data) => {
        this.announcements = data;
        this.filteredAnnouncements = [...data];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading announcements', error);
        this.isLoading = false;
      }
    });
  }
  
  loadAvailableUnits(): void {
    // This would typically come from a property or unit service
    // Mock data for now
    this.availableUnits = [
      { id: 101, unitNumber: 'Unit 101' },
      { id: 102, unitNumber: 'Unit 102' },
      { id: 103, unitNumber: 'Unit 103' },
      { id: 104, unitNumber: 'Unit 104' },
      { id: 105, unitNumber: 'Unit 105' },
      { id: 201, unitNumber: 'Unit 201' },
      { id: 202, unitNumber: 'Unit 202' }
    ];
  }
  
  toggleUnitSelection(unitId: number): void {
    const index = this.selectedUnitIds.indexOf(unitId);
    if (index > -1) {
      this.selectedUnitIds.splice(index, 1);
    } else {
      this.selectedUnitIds.push(unitId);
    }
  }
  
  isUnitSelected(unitId: number): boolean {
    return this.selectedUnitIds.includes(unitId);
  }
  
  viewAnnouncementDetails(announcement: Announcement): void {
    this.selectedAnnouncement = { ...announcement };
    this.showNewAnnouncementForm = false;
  }
  
  searchAnnouncements(): void {
    if (!this.searchTerm.trim()) {
      this.filteredAnnouncements = [...this.announcements];
      return;
    }
    
    const searchLower = this.searchTerm.toLowerCase();
    this.filteredAnnouncements = this.announcements.filter(a => 
      a.title.toLowerCase().includes(searchLower) || 
      a.content.toLowerCase().includes(searchLower)
    );
  }
  
  showNewAnnouncementDialog(): void {
    this.showNewAnnouncementForm = true;
    this.selectedAnnouncement = null;
    this.newAnnouncement = {
      title: '',
      content: '',
      issuedBy: this.authService.currentUserValue?.id || 0,
      isActive: true,
      startDate: new Date()
    };
    this.selectedUnitIds = [];
    this.recipientType = 'all';
  }
  
  cancelNewAnnouncement(): void {
    this.showNewAnnouncementForm = false;
  }
  
  saveAnnouncement(): void {
    if (!this.validateAnnouncementForm()) {
      return;
    }
    
    this.isSaving = true;
    
    // In a real app, we would handle recipient targeting via the propertyId
    // For now, we're just setting the issuedBy field from the current user
    this.newAnnouncement.issuedBy = this.authService.currentUserValue?.id || 0;
    
    // If this is for specific units, we would handle that in the backend
    // For now, we're just adding a property note about which units were selected
    if (this.recipientType === 'specific' && this.selectedUnitIds.length > 0) {
      this.newAnnouncement.content += `\n\nTargeted Units: ${this.selectedUnitIds.join(', ')}`;
    }
    
    this.announcementService.createAnnouncement(this.newAnnouncement).subscribe({
      next: (result) => {
        // Add the new announcement to the list
        this.announcements.unshift(result);
        this.filteredAnnouncements = [...this.announcements];
        this.isSaving = false;
        this.showNewAnnouncementForm = false;
      },
      error: (error) => {
        console.error('Error saving announcement', error);
        this.isSaving = false;
      }
    });
  }
  
  validateAnnouncementForm(): boolean {
    if (!this.newAnnouncement.title.trim()) {
      alert('Please enter a title for the announcement');
      return false;
    }
    
    if (!this.newAnnouncement.content.trim()) {
      alert('Please enter content for the announcement');
      return false;
    }
    
    if (this.recipientType === 'specific' && this.selectedUnitIds.length === 0) {
      alert('Please select at least one unit to send the announcement to');
      return false;
    }
    
    return true;
  }
  
  deleteAnnouncement(id: number): void {
    if (confirm('Are you sure you want to delete this announcement? This action cannot be undone.')) {
      this.announcementService.deleteAnnouncement(id).subscribe({
        next: () => {
          this.announcements = this.announcements.filter(a => a.announcementId !== id);
          this.filteredAnnouncements = this.filteredAnnouncements.filter(a => a.announcementId !== id);
          
          if (this.selectedAnnouncement && this.selectedAnnouncement.announcementId === id) {
            this.selectedAnnouncement = null;
          }
        },
        error: (error) => {
          console.error('Error deleting announcement', error);
        }
      });
    }
  }
  
  closeDetails(): void {
    this.selectedAnnouncement = null;
  }
}
