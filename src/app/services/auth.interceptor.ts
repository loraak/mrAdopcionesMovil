import {HttpErrorResponse, HttpInterceptor, HttpInterceptorFn} from "@angular/common/http";
import {API_URL, AuthService} from "./auth.service";
import {inject} from "@angular/core";
import {Router} from "@angular/router";
import {catchError, throwError} from "rxjs";


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const token = auth.token();

  const request =
    token && req.url.startsWith(API_URL)
    ? req.clone({setHeaders: {Authorization: `Bearer ${token}` } }) : req;

  return next(request).pipe(
    catchError((err: HttpErrorResponse) => {
      const esLogin = req.url.endsWith('/auth/login');
      if (err.status === 401 && token && !esLogin) {
        auth.logout();
        router.navigate(['/login'], {queryParams: {returnUrl: router.url}});
      }
      return throwError(() => err);
    })
  )

}
