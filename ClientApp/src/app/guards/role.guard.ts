import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { SessionManagerService } from '../services/session-manager.service';

export const roleGuard: CanActivateFn = (route) => {
  const session = inject(SessionManagerService);
  const router = inject(Router);
  const user = session.user;
  if (!user) {
    return router.parseUrl('/login');
  }
  const allowed = (route.data as { roles?: string[] })?.roles ?? [];
  if (allowed.length === 0) return true;
  const userRole = (user.userType || user.role || '').toString();
  return allowed.includes(userRole) ? true : router.parseUrl('/');
};
