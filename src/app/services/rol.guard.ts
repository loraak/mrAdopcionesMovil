import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService, Rol } from './auth.service';

export const rolGuard = (...roles: Rol[]): CanActivateFn => (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    auth.logout();
    return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
  }

  const role = auth.currentUser()?.rol;
  if (role && roles.includes(role)) {
    return true;
  }

  return router.createUrlTree(['/app/home']);
};
