import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Ticket, TicketComment } from '../models/ticket';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = 'https://localhost:7225/api/tickets';

  // Mock data for development
  private mockTickets: Ticket[] = [
    {
      id: 1,
      title: 'Leaky Faucet',
      description: 'The kitchen faucet is leaking and causing water damage.',
      status: 'Open',
      priority: 'Medium',
      category: 'Plumbing',
      createdAt: new Date(2023, 5, 15).toISOString(),
      tenantId: 1,
      propertyId: 1,
      unitId: 101,
      tenantName: 'John Tenant'
    },
    {
      id: 2,
      title: 'Broken AC',
      description: 'Air conditioner is not cooling properly.',
      status: 'In Progress',
      priority: 'High',
      category: 'HVAC',
      createdAt: new Date(2023, 6, 2).toISOString(),
      tenantId: 1,
      propertyId: 1,
      unitId: 101,
      tenantName: 'John Tenant'
    },
    {
      id: 3,
      title: 'Mailbox Key Replacement',
      description: 'I lost my mailbox key and need a replacement.',
      status: 'Resolved',
      priority: 'Low',
      category: 'Keys/Access',
      createdAt: new Date(2023, 4, 20).toISOString(),
      resolvedAt: new Date(2023, 4, 22).toISOString(),
      tenantId: 1,
      propertyId: 1,
      unitId: 101,
      tenantName: 'John Tenant'
    },
    {
      id: 4,
      title: 'Pest Control Needed',
      description: 'I have seen several cockroaches in my apartment.',
      status: 'Open',
      priority: 'Medium',
      category: 'Pest Control',
      createdAt: new Date(2023, 6, 10).toISOString(),
      tenantId: 3,
      propertyId: 1,
      unitId: 102,
      tenantName: 'Sarah Johnson'
    }
  ];

  constructor(private http: HttpClient) { }

  // Mock implementations
  getTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(this.apiUrl);
    //return of(this.mockTickets).pipe(delay(500));
  }

  getTicket(id: number): Observable<Ticket> {
    const ticket = this.mockTickets.find(t => t.id === id);
    return of(ticket as Ticket).pipe(delay(300));
  }

  getTicketsByTenant(tenantId: number): Observable<Ticket[]> {
    const tickets = this.mockTickets.filter(t => t.tenantId === tenantId);
    return of(tickets).pipe(delay(500));
  }

  getTicketsByProperty(propertyId: number): Observable<Ticket[]> {
    const tickets = this.mockTickets.filter(t => t.propertyId === propertyId);
    return of(tickets).pipe(delay(500));
  }

  createTicket(ticket: Ticket): Observable<Ticket> {
    ticket.tenantId = 8;
     return this.http.post<Ticket>(this.apiUrl, ticket);
    // const newTicket = {
    //   ...ticket,
    //   id: Math.max(...this.mockTickets.map(t => t.id || 0)) + 1,
    //   createdAt: new Date().toISOString(),
    //   status: 'Open'
    // };
    // this.mockTickets.push(newTicket);
    // return of(newTicket).pipe(delay(700));
  }

  updateTicket(id: number, ticket: Ticket): Observable<any> {
    const index = this.mockTickets.findIndex(t => t.id === id);
    if (index !== -1) {
      this.mockTickets[index] = { ...this.mockTickets[index], ...ticket };
    }
    return of({ success: true }).pipe(delay(500));
  }

  updateTicketStatus(id: number, status: string): Observable<any> {
    const index = this.mockTickets.findIndex(t => t.id === id);
    if (index !== -1) {
      this.mockTickets[index].status = status;
      if (status === 'Resolved') {
        this.mockTickets[index].resolvedAt = new Date().toISOString();
      }
    }
    return of({ success: true }).pipe(delay(500));
  }

  addComment(ticketId: number, comment: TicketComment): Observable<TicketComment> {
    const newComment = {
      ...comment,
      id: Math.floor(Math.random() * 1000),
      createdAt: new Date().toISOString()
    };
    return of(newComment).pipe(delay(500));
  }

  deleteTicket(id: number): Observable<any> {
    this.mockTickets = this.mockTickets.filter(t => t.id !== id);
    return of({ success: true }).pipe(delay(500));
  }
}
