import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  confirmMatchResult,
  confirmMatchResultFailure,
  confirmMatchResultSuccess,
  deleteMatchResult,
  deleteMatchResultFailure,
  deleteMatchResultSuccess,
  getRanking,
  getRankingFailure,
  getRankingSuccess,
  getUserMatches,
  getUserMatchesFailure,
  getUserMatchesStats,
  getUserMatchesStatsFailure,
  getUserMatchesStatsSuccess,
  getUserMatchesSuccess,
  loadAdminPostedMatches,
  loadAdminPostedMatchesFailure,
  loadAdminPostedMatchesSuccess,
  publishMatchResult,
  publishMatchResultFailure,
  publishMatchResultSuccess,
  rejectMatchResult,
  rejectMatchResultFailure,
  rejectMatchResultSuccess,
} from '../actions/event.actions';
import {
  catchError,
  filter,
  map,
  mergeMap,
  of,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import { MatchService } from 'src/app/services/match.service';
import { loadUserNotifications } from '../actions/notification.actions';
import { StatisticsService } from 'src/app/services/statistics.service';
import { select, Store } from '@ngrx/store';
import { selectAdminPostedMatchesState } from '../selectors/event.selectors';
import { selectUser } from '../selectors/users.selectors';
import { CLUB_ADMIN_ROLE } from 'src/app/modules/shared/constants/Constants.constants';
import {
  getLast10DoublesMatches,
  getLast10SinglesMatches,
} from '../dashboard-state/dashboard.actions';

@Injectable()
export class EventEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly matchService: MatchService,
    private readonly statisticsService: StatisticsService,
    private readonly store: Store<any>
  ) {}

  publishMatchResult$ = createEffect(() =>
    this.actions$.pipe(
      ofType(publishMatchResult),
      switchMap(({ matchResult }) =>
        this.matchService.publishMatchResult(matchResult).pipe(
          map(() => publishMatchResultSuccess()),
          catchError((error) => of(publishMatchResultFailure({ error })))
        )
      )
    )
  );

  loadUserMatchesAfterPostMatchResult$ = createEffect(() =>
    this.actions$.pipe(
      ofType(publishMatchResultSuccess),
      mergeMap(() => [getLast10SinglesMatches(), getLast10DoublesMatches()])
    )
  );

  getUserMatchesResult$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getUserMatches),
      switchMap(({ matchtype, page, size }) =>
        this.matchService.getUserMatches(undefined, matchtype, page, size).pipe(
          map((matches) =>
            getUserMatchesSuccess({
              matches: matches,
            })
          ),
          catchError((error) => of(getUserMatchesFailure({ error })))
        )
      )
    )
  );

  confirmMatchResult$ = createEffect(() =>
    this.actions$.pipe(
      ofType(confirmMatchResult),
      switchMap(({ matchId }) =>
        this.matchService.matchConfirmationAction(matchId, 'confirm').pipe(
          map(() => confirmMatchResultSuccess()),
          catchError((error) => of(confirmMatchResultFailure({ error })))
        )
      )
    )
  );

  rejectMatchResult$ = createEffect(() =>
    this.actions$.pipe(
      ofType(rejectMatchResult),
      switchMap(({ matchId }) =>
        this.matchService.matchConfirmationAction(matchId, 'reject').pipe(
          map(() => rejectMatchResultSuccess()),
          catchError((error) => of(rejectMatchResultFailure({ error })))
        )
      )
    )
  );

  loadMatchesAfterMatchResultAction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        confirmMatchResultSuccess,
        rejectMatchResultSuccess,
        deleteMatchResultSuccess
      ),
      mergeMap(() => [getLast10SinglesMatches(), getLast10DoublesMatches()])
    )
  );

  reloadNotifictionAfterMatchAction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        confirmMatchResultSuccess,
        rejectMatchResultSuccess,
        deleteMatchResultSuccess
      ),
      map(() => loadUserNotifications())
    )
  );

  deleteMatchResult$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteMatchResult),
      switchMap(({ matchId }) =>
        this.matchService.deleteMatchResult(matchId).pipe(
          map(() => deleteMatchResultSuccess()),
          catchError((error) => of(deleteMatchResultFailure({ error })))
        )
      )
    )
  );

  getUserMatchesStats$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getUserMatchesStats),
      switchMap(({ matchType }) =>
        this.matchService.getUserMatchesStats(matchType).pipe(
          map((stats) => getUserMatchesStatsSuccess({ stats })),
          catchError((error) => of(getUserMatchesStatsFailure({ error })))
        )
      )
    )
  );

  getRanking$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getRanking),
      switchMap(() =>
        this.statisticsService.getGeneralRanking().pipe(
          map((ranking) => getRankingSuccess({ ranking })),
          catchError((error) => of(getRankingFailure({ error })))
        )
      )
    )
  );

  loadPostedAdminMatches = createEffect(() =>
    this.actions$.pipe(
      ofType(loadAdminPostedMatches),
      withLatestFrom(this.store.pipe(select(selectAdminPostedMatchesState))),
      switchMap(() => {
        return this.matchService.getAdminPostedMatches().pipe(
          map((matches) => loadAdminPostedMatchesSuccess({ matches })),
          catchError((error) => of(loadAdminPostedMatchesFailure({ error })))
        );
      })
    )
  );

  loadPostedAdminMatchesAfterPostingAResult$ = createEffect(() =>
    this.actions$.pipe(
      ofType(publishMatchResultSuccess),
      withLatestFrom(this.store.select(selectUser)),
      filter(([_, user]) => user?.role === CLUB_ADMIN_ROLE),
      map(() => loadAdminPostedMatches())
    )
  );
}
