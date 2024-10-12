import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ClubConfigurationService } from 'src/app/services/club-configuration.service';
import {
  createCourt,
  createCourtFailure,
  createCourtSuccess,
  loadCourts,
  loadCourtsFailure,
  loadCourtsSuccess,
} from '../actions/clubConfiguration.actions';
import { HttpErrorResponse } from 'src/app/models/httpErrorResponse.model';

@Injectable()
export class ClubConfigurationEffects {
  loadCourts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCourts, createCourtSuccess),
      mergeMap(() =>
        this.clubConfigurationService.getClubCourts().pipe(
          map((courts) => loadCourtsSuccess({ courts })),
          catchError((error) => of(loadCourtsFailure({ error })))
        )
      )
    )
  );

  createCourt$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createCourt),
      mergeMap(({ court }) =>
        this.clubConfigurationService.createCourt(court).pipe(
          map(({ id }) => createCourtSuccess({ id })),
          catchError((error: HttpErrorResponse) =>
            of(createCourtFailure({ error }))
          )
        )
      )
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly clubConfigurationService: ClubConfigurationService
  ) {}
}
function errorCreatingCourt(arg0: { error: any }): any {
  throw new Error('Function not implemented.');
}
