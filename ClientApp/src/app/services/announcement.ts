import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Announcement } from '../models/announcement';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {
  private apiUrl = 'https://localhost:7225/api/announcements';

  constructor(private http: HttpClient) { }

  getAnnouncements(): Observable<Announcement[]> {
    return this.http.get<Announcement[]>(this.apiUrl);
  }

  getAnnouncement(id: number): Observable<Announcement> {
    return this.http.get<Announcement>(`${this.apiUrl}/${id}`);
  }

  getAnnouncementsByProperty(propertyId: number): Observable<Announcement[]> {
    return this.http.get<Announcement[]>(`${this.apiUrl}/ByProperty/${propertyId}`);
  }

  getAnnouncementsForTenant(tenantId: number): Observable<Announcement[]> {
    return this.http.get<Announcement[]>(`${this.apiUrl}/ForTenant/${tenantId}`);
  }

  createAnnouncement(announcement: Announcement): Observable<Announcement> {
    return this.http.post<Announcement>(this.apiUrl, announcement);
  }

  updateAnnouncement(id: number, announcement: Announcement): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, announcement);
  }

  deleteAnnouncement(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
