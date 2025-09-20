import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, tap, catchError } from 'rxjs/operators';
import { User } from '../models/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private apiUrl = 'https://localhost:7225/api/users';
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  // Mock users for development
  private mockUsers: User[] = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Tenant',
      email: 'tenant@example.com',
      password: 'password123',
      userType: 'Tenant',
      phoneNumber: '123-456-7890',
      propertyId: 1,
      unitId: 101
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Admin',
      email: 'admin@example.com',
      password: 'password123',
      userType: 'Admin',
      phoneNumber: '123-456-7891'
    }
  ];

  constructor(private http: HttpClient, private router: Router) { 
    const savedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      savedUser ? JSON.parse(savedUser) : null
    );
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<User> {
    // Mock login for development
    debugger
    return this.http.post<User>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(user => {
      // Remove password from user object before storing
      const { password, ...userWithoutPassword } = user;
      const safeUser = userWithoutPassword as User;

      localStorage.setItem('currentUser', JSON.stringify(safeUser));
      this.currentUserSubject.next(safeUser);
      }),
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );

    // if (user) {
    //   // Remove password from user object before storing
    //   const { password, ...userWithoutPassword } = user;
    //   const safeUser = userWithoutPassword as User;
      
    //   localStorage.setItem('currentUser', JSON.stringify(safeUser));
    //   this.currentUserSubject.next(safeUser);
    //   return of(safeUser).pipe(delay(800)); // Simulate API delay
    // }
    
    // return throwError(() => new Error('Invalid email or password'));
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  register(user: User): Observable<User> {
    // Mock register for development
    debugger
    return this.http.post<User>(`${this.apiUrl}/register`, user).pipe(
      tap(newUser => {
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      this.currentUserSubject.next(newUser);
      }),
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }
}
