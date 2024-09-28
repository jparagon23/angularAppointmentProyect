import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, switchMap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import {
  loadUser,
  loadUserFailure,
  loadUserSuccess,
} from '../actions/users.actions';

@Injectable()
export class ProfileEffects {
  loadProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUser),
      switchMap(() =>
        this.authService.getProfile().pipe(
          mergeMap((user) => [loadUserSuccess({ user: user.data[0] })]),
          catchError((error) => of(loadUserFailure({ error })))
        )
      )
    )
  );

  constructor(private actions$: Actions, private authService: AuthService) {}
}
