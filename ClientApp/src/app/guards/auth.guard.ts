import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { SessionManagerService } from '../services/session-manager.service';

export const authGuard: CanActivateFn = () => {
  const session = inject(SessionManagerService);
  const router = inject(Router);
  const token = session.token;

  if (token) {
    // Optional: validate exp via SessionManager
    return true;
  }
  return router.parseUrl('/login');
};
