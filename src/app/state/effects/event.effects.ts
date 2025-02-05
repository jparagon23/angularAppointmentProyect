import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  confirmMatchResult,
  confirmMatchResultFailure,
  confirmMatchResultSuccess,
  deleteMatchResult,
  deleteMatchResultFailure,
  deleteMatchResultSuccess,
  getUserMatches,
  getUserMatchesStats,
  getUserMatchesStatsFailure,
  getUserMatchesStatsSuccess,
  getUserMathcesFailure,
  getUserMathcesSuccess,
  publishMatchResult,
  publishMatchResultFailure,
  publishMatchResultSuccess,
  rejectMatchResult,
  rejectMatchResultFailure,
  rejectMatchResultSuccess,
} from '../actions/event.actions';
import { catchError, map, of, switchMap } from 'rxjs';
import { MatchService } from 'src/app/services/match.service';
import { loadUserNotifications } from '../actions/notification.actions';

@Injectable()
export class EventEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly matchService: MatchService
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
      map(() => getUserMatches())
    )
  );

  getUserMatchesResult$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getUserMatches),
      switchMap(() =>
        this.matchService.getUserMatches().pipe(
          map((matches) => getUserMathcesSuccess({ matches })),
          catchError((error) => of(getUserMathcesFailure({ error })))
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
      map(() => getUserMatches())
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
}
