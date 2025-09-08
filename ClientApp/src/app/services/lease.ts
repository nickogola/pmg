import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lease } from '../models/lease';

@Injectable({
  providedIn: 'root'
})
export class LeaseService {
  private apiUrl = '/api/leases';

  constructor(private http: HttpClient) { }

  getLeases(): Observable<Lease[]> {
    return this.http.get<Lease[]>(this.apiUrl);
  }

  getLease(id: number): Observable<Lease> {
    return this.http.get<Lease>(`${this.apiUrl}/${id}`);
  }

  createLease(lease: Lease): Observable<Lease> {
    return this.http.post<Lease>(this.apiUrl, lease);
  }

  updateLease(id: number, lease: Lease): Observable<Lease> {
    return this.http.put<Lease>(`${this.apiUrl}/${id}`, lease);
  }

  terminateLease(id: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/terminate`, {});
  }

  deleteLease(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
