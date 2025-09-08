import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TicketService } from '../../../services/ticket';
import { Ticket } from '../../../models/ticket';

@Component({
  selector: 'app-manage-tickets',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './manage-tickets.html',
  styleUrl: './manage-tickets.scss'
})
export class ManageTickets implements OnInit {
  tickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];
  isLoading = true;
  searchTerm = '';
  statusFilter = 'all';
  priorityFilter = 'all';
  categoryFilter = 'all';
  selectedTicket: Ticket | null = null;
  commentText = '';
  isSubmitting = false;

  constructor(private ticketService: TicketService) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.isLoading = true;
    this.ticketService.getTickets().subscribe({
      next: (tickets) => {
        this.tickets = tickets;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading tickets:', error);
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredTickets = this.tickets.filter(ticket => {
      // Search term filter
      const searchMatch = !this.searchTerm || 
        ticket.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (ticket.description && ticket.description.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (ticket.tenantName && ticket.tenantName.toLowerCase().includes(this.searchTerm.toLowerCase()));
      
      // Status filter
      const statusMatch = this.statusFilter === 'all' || ticket.status === this.statusFilter;
      
      // Priority filter
      const priorityMatch = this.priorityFilter === 'all' || ticket.priority === this.priorityFilter;
      
      // Category filter
      const categoryMatch = this.categoryFilter === 'all' || ticket.category === this.categoryFilter;
      
      return searchMatch && statusMatch && priorityMatch && categoryMatch;
    });
  }

  viewTicketDetails(ticket: Ticket): void {
    this.selectedTicket = ticket;
  }

  closeDetails(): void {
    this.selectedTicket = null;
    this.commentText = '';
  }

  updateTicketStatus(ticketId: number, status: string): void {
    this.isSubmitting = true;
    this.ticketService.updateTicketStatus(ticketId, status).subscribe({
      next: () => {
        // Update the ticket in the local array
        const index = this.tickets.findIndex(t => t.id === ticketId);
        if (index !== -1) {
          this.tickets[index].status = status;
          if (status === 'Resolved') {
            this.tickets[index].resolvedAt = new Date().toISOString();
          }
        }
        this.applyFilters();
        if (this.selectedTicket && this.selectedTicket.id === ticketId) {
          this.selectedTicket.status = status;
        }
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Error updating ticket status:', error);
        this.isSubmitting = false;
      }
    });
  }

  addComment(ticketId: number): void {
    if (!this.commentText.trim()) return;
    
    this.isSubmitting = true;
    const comment = {
      ticketId: ticketId,
      userId: 2, // Admin user ID
      comment: this.commentText.trim()
    };
    
    this.ticketService.addComment(ticketId, comment).subscribe({
      next: (newComment) => {
        if (this.selectedTicket) {
          if (!this.selectedTicket.comments) {
            this.selectedTicket.comments = [];
          }
          this.selectedTicket.comments.push(newComment);
        }
        this.commentText = '';
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Error adding comment:', error);
        this.isSubmitting = false;
      }
    });
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'Open': return 'bg-yellow-100 text-yellow-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'Closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getPriorityClass(priority: string): string {
    switch(priority) {
      case 'Low': return 'bg-gray-100 text-gray-800';
      case 'Medium': return 'bg-blue-100 text-blue-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Emergency': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}
