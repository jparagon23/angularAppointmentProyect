import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
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

  navigateAfterLogin$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginSuccess),
        tap(() => this.router.navigate(['/home']))
      ),
    { dispatch: false }
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logout),
      map(() => {
        // Aquí puedes agregar lógica adicional para el logout si es necesario
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
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {}
}
