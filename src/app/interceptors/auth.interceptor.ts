import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retryWhen, delay, scan } from 'rxjs/operators';
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
    return next.handle(this.addAuthToken(req)).pipe(
      retryWhen((errors) =>
        errors.pipe(
          scan((retryCount, error) => {
            if (
              retryCount >= this.maxRetries ||
              !(error instanceof HttpErrorResponse) ||
              error.status !== 0
            ) {
              throw error;
            }
            return retryCount + 1;
          }, 0),
          delay(this.retryDelayMs)
        )
      ),
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
    this.tokenService.removeToken();
    this.modalService.closeAllModals();
    this.router.navigate(['/login']);
  }
}
