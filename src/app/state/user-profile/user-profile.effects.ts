import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { StatisticsService } from 'src/app/services/statistics.service';
import { UserService } from 'src/app/services/user.service';
import {
  loadUserProfile,
  loadUserProfileFailure,
  loadUserProfileSuccess,
} from './user-profile.actions';
import { catchError, map, of, switchMap } from 'rxjs';

@Injectable()
export class UserProfileEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly statisticsService: StatisticsService,
    private readonly userService: UserService,
    private readonly store: Store<any>
  ) {}

  loadUserProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUserProfile),
      switchMap(({ id }) =>
        this.userService.getUserById(id).pipe(
          map((user) => loadUserProfileSuccess({ userProfile: user })),
          catchError((error) => of(loadUserProfileFailure({ error })))
        )
      )
    )
  );
}
