import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import {
  login,
  loginFailure,
  loginSuccess,
  logout,
  resendAuthenticationCode,
  resendAuthenticationCodeFailure,
  resendAuthenticationCodeSuccess,
  validateToken,
  validateTokenFailure,
  validateTokenSuccess,
} from '../actions/auth.actions';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      mergeMap((action) =>
        this.authService
          .login({ email: action.email, password: action.password })
          .pipe(
            map((response) => {
              if (response.error === 'Pending account confirmation') {
                return loginFailure({
                  error: response.error,
                  userId: response.userId,
                });
              }
              return loginSuccess({
                accessToken: response.access_token,
                refreshToken: response.refresh_token,
              });
            }),
            catchError((error) => of(loginFailure({ error })))
          )
      )
    )
  );

  resendAuthenticationCode$ = createEffect(() =>
    this.actions$.pipe(
      ofType(resendAuthenticationCode),
      mergeMap((action) =>
        this.authService.resendAuthenticationCode().pipe(
          map(() => resendAuthenticationCodeSuccess()),
          catchError((error) => of(resendAuthenticationCodeFailure({ error })))
        )
      )
    )
  );

  loginFailureAuthAccount$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginFailure),
        map((action) => {
          if (action.error && action.error.status === 403) {
            console.log(action.error);

            // Call the function to resend the authentication code
            if (action.error.error.userId) {
              console.log('User ID:', action.error.error.userId);

              this.authService.setUserId(action.error.error.userId);
            } else {
              console.error('User ID is undefined');
            }
            this.router.navigate(['/register/authAccount']);
            return { type: '[Auth] Resend Authentication Code' };

            // Navigate to the authentication account registration page
          } else {
            console.error('Login failed with status:', action.error?.status);
            return { type: '[Auth] Login Failure Handled' }; // Return a default action
          }
        })
      ),
    { dispatch: true }
  );

  loadUserAfterLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginSuccess),
      map(() => {
        return { type: '[Profile] Load Profile' };
      })
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logout),
      map(() => {
        this.authService.logout();
        this.router.navigate(['/login']);
        return { type: '[Auth] Logout Success' };
      })
    )
  );

  authenticateAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(validateToken),
      mergeMap((action) =>
        this.authService.authToken(action.token).pipe(
          map(() => validateTokenSuccess()),
          catchError((error) => of(validateTokenFailure({ error })))
        )
      )
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}
}
