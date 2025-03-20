import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { StatisticsService } from 'src/app/services/statistics.service';
import { UserService } from 'src/app/services/user.service';
import {
  loadUserProfile,
  loadUserProfileFailure,
  loadUserProfileMatches,
  loadUserProfileMatchesFailure,
  loadUserProfileMatchesSuccess,
  loadUserProfileStats,
  loadUserProfileStatsFailure,
  loadUserProfileStatsSuccess,
  loadUserProfileSuccess,
} from './user-profile.actions';
import { catchError, map, of, switchMap } from 'rxjs';
import { MatchService } from 'src/app/services/match.service';

@Injectable()
export class UserProfileEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly statisticsService: StatisticsService,
    private readonly userService: UserService,
    private readonly matchService: MatchService,
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

  loadUserProfileMatches$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUserProfileMatches),
      switchMap(({ id }) =>
        this.matchService.getUserMatches(id, 'ALL').pipe(
          map((matches) =>
            loadUserProfileMatchesSuccess({
              matches: matches._embedded.matchResponseDTOList,
            })
          ),
          catchError((error) => of(loadUserProfileMatchesFailure({ error })))
        )
      )
    )
  );

  LoadUserProfileStats$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUserProfileStats),
      switchMap(({ id, matchType }) =>
        this.matchService.getUserMatchesStats(matchType, id).pipe(
          map((stats) => loadUserProfileStatsSuccess({ stats })),
          catchError((error) => of(loadUserProfileStatsFailure({ error })))
        )
      )
    )
  );
}
