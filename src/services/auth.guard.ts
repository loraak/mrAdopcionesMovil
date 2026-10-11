import {AuthService} from "./auth.service";
import {inject} from "@angular/core";
import {CanActivateFn, Router} from "@angular/router";

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) {
    return true;
  }

  auth.logout();

  return router.createUrlTree(['/login'], {queryParams: {returnUrl: state.url}});
}
