import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import {
  login,
  loginFailure,
  loginSuccess,
  logout,
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
            map((response) =>
              loginSuccess({
                accessToken: response.access_token,
                refreshToken: response.refresh_token,
              })
            ),
            catchError((error) => of(loginFailure({ error })))
          )
      )
    )
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
