import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SessionManagerService {
  private tokenKey = 'auth_token';
  private userKey = 'currentUser';
  private authState$ = new BehaviorSubject<boolean>(this.hasValidToken());

  isAuthenticated$ = this.authState$.asObservable();

  setSession(token: string, user: any) {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
    this.authState$.next(this.hasValidToken());
  }

  get token(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  get user(): any | null {
    const v = localStorage.getItem(this.userKey);
    return v ? JSON.parse(v) : null;
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.authState$.next(false);
  }

  private hasValidToken(): boolean {
    const t = this.token;
    if (!t) return false;
    try {
      const payload = JSON.parse(atob(t.split('.')[1]));
      const exp = payload['exp'];
      if (!exp) return false;
      const nowSec = Math.floor(Date.now() / 1000);
      return exp > nowSec;
    } catch {
      return false;
    }
  }
}
