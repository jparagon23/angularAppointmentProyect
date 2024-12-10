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
import { EventsService } from 'src/app/services/events.service';

@Injectable()
export class EventEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly eventService: EventsService
  ) {}

  publishMatchResult$ = createEffect(() =>
    this.actions$.pipe(
      ofType(publishMatchResult),
      switchMap(({ matchResult }) =>
        this.eventService.publishMatchResult(matchResult).pipe(
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
        this.eventService.getUserMatches().pipe(
          map((matches) => getUserMathcesSuccess({ matches })),
          catchError((error) => of(getUserMathcesFailure({ error })))
        )
      )
    )
  );
}
