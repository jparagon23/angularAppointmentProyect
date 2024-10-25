import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, switchMap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import {
  loadUser,
  loadUserFailure,
  loadUserSuccess,
  updateUser,
  updateUserFailure,
  updateUserSuccess,
} from '../actions/users.actions';
import { UserService } from 'src/app/services/user.service';

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

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateUser),
      switchMap(({ user }) =>
        this.userService.updateUser(user).pipe(
          map((user) => updateUserSuccess({ user: user })),
          catchError((error) => of(updateUserFailure({ error })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private userService: UserService
  ) {}
}
