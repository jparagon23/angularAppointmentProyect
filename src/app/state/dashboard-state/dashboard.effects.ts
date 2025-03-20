import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap } from 'rxjs';
import { MatchService } from 'src/app/services/match.service';
import {
  getLast10DoublesMatches,
  getLast10DoublesMatchesFailure,
  getLast10DoublesMatchesSuccess,
  getLast10SinglesMatches,
  getLast10SinglesMatchesFailure,
  getLast10SinglesMatchesSuccess,
} from './dashboard.actions';

@Injectable()
export class DashboardEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly matchService: MatchService,
    private readonly store: Store<any>
  ) {}

  getTop10SingleMatches$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getLast10SinglesMatches),
      switchMap(() =>
        this.matchService.getUserMatches().pipe(
          map((matches) =>
            getLast10SinglesMatchesSuccess({
              matches: matches._embedded.matchResponseDTOList,
            })
          ),
          catchError((error) => of(getLast10SinglesMatchesFailure({ error })))
        )
      )
    )
  );

  getTopDoublesMatches$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getLast10DoublesMatches),
      switchMap(() =>
        this.matchService.getUserMatches(undefined, 'DOUBLES').pipe(
          map((matches) =>
            getLast10DoublesMatchesSuccess({
              matches: matches._embedded.matchResponseDTOList,
            })
          ),
          catchError((error) => of(getLast10DoublesMatchesFailure({ error })))
        )
      )
    )
  );
}
