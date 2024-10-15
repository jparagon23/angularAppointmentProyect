import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ClubConfigurationService } from 'src/app/services/club-configuration.service';
import {
  createCourt,
  createCourtFailure,
  createCourtSuccess,
  loadAvailability,
  loadAvailabilityFailure,
  loadAvailabilitySuccess,
  loadCourts,
  loadCourtsFailure,
  loadCourtsSuccess,
  saveAvailability,
  saveAvailabilityFailure,
  saveAvailabilitySuccess,
} from '../actions/clubConfiguration.actions';
import { HttpErrorResponse } from 'src/app/models/httpErrorResponse.model';

@Injectable()
export class ClubConfigurationEffects {
  loadCourts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCourts),
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

  reloadCourtsAfterCreate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createCourtSuccess),
      map(() => loadCourts())
    )
  );

  loadAvailability$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadAvailability),
      mergeMap(() =>
        this.clubConfigurationService.getAvailability().pipe(
          map((availability) => loadAvailabilitySuccess({ availability })),
          catchError((error) => of(loadAvailabilityFailure({ error })))
        )
      )
    )
  );

  saveAvailability$ = createEffect(() =>
    this.actions$.pipe(
      ofType(saveAvailability),
      mergeMap((action) =>
        this.clubConfigurationService
          .saveAvailability(action.availability)
          .pipe(
            map(() =>
              saveAvailabilitySuccess({ availability: action.availability })
            ),
            catchError((error) => of(saveAvailabilityFailure({ error })))
          )
      )
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly clubConfigurationService: ClubConfigurationService
  ) {}
}
