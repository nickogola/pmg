import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Lease } from '../models/lease';

@Injectable({
  providedIn: 'root'
})
export class LeaseService {
  private apiUrl = 'https://localhost:7225/api/leases';

  constructor(private http: HttpClient) { }

  getLeases(): Observable<Lease[]> {
    return this.http.get<Lease[]>(this.apiUrl)
      .pipe(
        tap(leases => console.log('Fetched leases:', leases)),
        catchError(this.handleError<Lease[]>('getLeases', []))
      );
  }

  getLease(id: number): Observable<Lease> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Lease>(url)
      .pipe(
        tap(_ => console.log(`Fetched lease id=${id}`)),
        catchError(this.handleError<Lease>(`getLease id=${id}`))
      );
  }

  createLease(lease: Lease): Observable<Lease> {
    return this.http.post<Lease>(this.apiUrl, lease)
      .pipe(
        tap(newLease => console.log(`Created lease w/ id=${newLease.leaseId}`)),
        catchError(this.handleError<Lease>('createLease'))
      );
  }

  updateLease(id: number, lease: Lease): Observable<Lease> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Lease>(url, lease)
      .pipe(
        tap(_ => console.log(`Updated lease id=${id}`)),
        catchError(this.handleError<Lease>('updateLease'))
      );
  }

  terminateLease(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}/terminate`;
    return this.http.patch<any>(url, {})
      .pipe(
        tap(_ => console.log(`Terminated lease id=${id}`)),
        catchError(this.handleError<any>('terminateLease'))
      );
  }

  deleteLease(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<any>(url)
      .pipe(
        tap(_ => console.log(`Deleted lease id=${id}`)),
        catchError(this.handleError<any>('deleteLease'))
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
