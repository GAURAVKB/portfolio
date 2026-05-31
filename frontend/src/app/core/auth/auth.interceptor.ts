import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from '@env/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Only attach JWT to requests going to the Java API — never to Go service or external URLs
  const isApiRequest = req.url.startsWith(environment.apiUrl);
  if (!isApiRequest) {
    return next(req);
  }

  const token = inject(AuthService).getToken();
  if (token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
  return next(req);
};
