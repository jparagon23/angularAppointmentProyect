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
import { loginSuccess } from '../actions/auth.actions';
import { loadUserNotifications } from '../actions/notification.actions';
import { getRanking, getUserMatches } from '../actions/event.actions';
import { loadReservations } from '../actions/reservations.actions';
import {
  getLast10DoublesMatches,
  getLast10SinglesMatches,
} from '../dashboard-state/dashboard.actions';

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

  loadUserAfterLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginSuccess),
      map(() => loadUser())
    )
  );

  loadUserDependencies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUserSuccess), // Escucha la acción loadUserSuccess
      switchMap(() => [
        loadUserNotifications(), // Despacha loadUserNotifications
        getLast10SinglesMatches(),
        getLast10DoublesMatches(),
        getRanking(),
        loadReservations(),
      ])
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}
}
