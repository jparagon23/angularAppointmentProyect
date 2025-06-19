import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, retryWhen, delay, scan, tap, retry } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ModalService } from '../services/modal.service';
import { TokenService } from '../services/token.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly retryDelayMs = 8000;
  private isRedirecting = false;

  constructor(
    private readonly router: Router,
    private readonly modalService: ModalService,
    private readonly tokenService: TokenService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(this.addAuthToken(req)).pipe(
      retry({
        count: 4,
        delay: (error, retryCount) => {
          const isRetryableError =
            error instanceof HttpErrorResponse &&
            (error.status === 0 || error.status === 504);
          const isGetMethod = req.method === 'GET';

          if (!isRetryableError || !isGetMethod) {
            throw error;
          }

          console.warn(`Retrying request... Attempt ${retryCount}`);
          return timer(this.retryDelayMs); // 8000 ms
        },
      }),
      catchError((error: HttpErrorResponse) => this.handleAuthError(error, req))
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
  private handleAuthError(
    error: HttpErrorResponse,
    req: HttpRequest<any>
  ): Observable<never> {
    console.error(`HTTP Error on ${req.url}:`, error);

    if (error.status === 401) {
      this.handleUnauthorizedError();
    }

    return throwError(() => error);
  }

  /**
   * Handles 401 Unauthorized errors by removing the token, closing modals,
   * and redirecting to the login page only once
   */
  private handleUnauthorizedError(): void {
    if (this.isRedirecting) return;

    this.isRedirecting = true;
    this.tokenService.removeToken();
    this.modalService.closeAllModals();

    this.router.navigate(['/login']).finally(() => {
      this.isRedirecting = false;
    });
  }
}
