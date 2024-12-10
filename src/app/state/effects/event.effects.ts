import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  getUserMatches,
  getUserMathcesFailure,
  getUserMathcesSuccess,
  publishMatchResult,
  publishMatchResultFailure,
  publishMatchResultSuccess,
} from '../actions/event.actions';
import { catchError, map, of, switchMap } from 'rxjs';
import { MatchService } from 'src/app/services/match.service';

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
}
