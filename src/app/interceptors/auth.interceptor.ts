import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ModalService } from '../services/modal.service';
import { TokenService } from '../services/token.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly maxRetries = 3;
  private readonly retryDelayMs = 6000;

  constructor(
    private router: Router,
    private modalService: ModalService,
    private tokenService: TokenService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log('Intercepting request:', req);
    return next.handle(this.addAuthToken(req)).pipe(
      retry({
        count: this.maxRetries,
        delay: (error, retryCount) => {
          return new Observable((observer) => {
            setTimeout(() => {
              observer.next();
              observer.complete();
            }, this.retryDelayMs);
          });
        },
      }),
      catchError((error: HttpErrorResponse) => this.handleAuthError(error))
    );
  }

  /**
   * Adds the authentication token to the request if available
   */
  private addAuthToken(req: HttpRequest<any>): HttpRequest<any> {
    const token = this.tokenService.getToken();
    if (token) {
      return req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return req;
  }

  /**
   * Handles HTTP errors, specifically dealing with unauthorized errors
   */
  private handleAuthError(error: HttpErrorResponse): Observable<never> {
    console.error('HTTP Error:', error);
    if (error.status === 401) {
      this.handleUnauthorizedError();
    }
    return throwError(() => error);
  }

  /**
   * Handles 401 Unauthorized errors by removing the token, closing modals,
   * and redirecting to the login page
   */
  private handleUnauthorizedError(): void {
    console.log('Unauthorized error, redirecting to login.');
    this.tokenService.removeToken();
    this.modalService.closeAllModals();
    this.router.navigate(['/login']);
  }
}
