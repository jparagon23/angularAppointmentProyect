import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, delay, retry, retryWhen, scan } from 'rxjs/operators';
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
    retryWhen((errors) =>
      errors.pipe(
        scan((retryCount, error) => {

          
          const isRetryableError =
            error instanceof HttpErrorResponse &&
            (error.status === 504 || error.status === 0);

            console.log("is retryable",isRetryableError);
            

          if (!isRetryableError || retryCount >= 4) {
            throw error;
          }

          console.warn(
            `Retrying ${req.method} ${req.url} due to ${error.status}. Attempt #${retryCount + 1}`
          );
          return retryCount + 1;
        }, 0),
        // Espera 8 segundos antes del siguiente intento
        delay(this.retryDelayMs)
      )
    ),
    catchError((error: HttpErrorResponse) =>
      this.handleAuthError(error, req)
    )
  );
}

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
