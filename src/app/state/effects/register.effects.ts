import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import * as AuthActions from '../actions/register.actions';
import swal from 'sweetalert2';
import { HttpResponse } from '@angular/common/http';
import { EmailAvailabilityResponse } from 'src/app/models/EmailAvailabilityResponse.model';

@Injectable()
export class RegisterEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  loadInitialSignUpData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadInitialSignUpData),
      mergeMap(() =>
        this.authService.getInitialSignUpData().pipe(
          map((data) => AuthActions.loadInitialSignUpDataSuccess({ data })),
          catchError(() => of(AuthActions.loadInitialSignUpDataFailure()))
        )
      )
    )
  );

  checkEmailAvailability$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.checkEmailAvailability),
      mergeMap(({ email }) =>
        this.authService.checkEmailAvailability(email).pipe(
          map((response: HttpResponse<EmailAvailabilityResponse>) =>
            AuthActions.checkEmailAvailabilitySuccess({
              emailAvailabilityResponse:
                response.body as EmailAvailabilityResponse,
            })
          ),
          catchError(() => of(AuthActions.checkEmailAvailabilityFailure()))
        )
      )
    )
  );

  registerUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.registerUser),
      mergeMap(({ formData }) =>
        this.authService.createUser(formData).pipe(
          map(() => AuthActions.registerUserSuccess()),
          catchError((error) =>
            of(
              AuthActions.registerUserFailure({ error: error.error.message[0] })
            )
          )
        )
      )
    )
  );

  registerUserSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.registerUserSuccess),
        tap(() => {
          this.router.navigate(['authAccount']);
        })
      ),
    { dispatch: false }
  );

  registerUserFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.registerUserFailure),
        tap(({ error }) => {
          swal.fire('Error', error, 'error');
        })
      ),
    { dispatch: false }
  );
}
