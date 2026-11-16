import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const noAdminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const esAdmin = auth.isLoggedIn() && auth.currentUser()?.rol === 'ADMIN';
  return esAdmin ? router.createUrlTree(['/app/reportes']) : true;
};
