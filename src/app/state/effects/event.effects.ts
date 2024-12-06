import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
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
}
