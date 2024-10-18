import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  concatMap,
  map,
  mergeMap,
  of,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import { ReservationService } from 'src/app/services/reservation.service';
import {
  cancelReservation,
  cancelReservationAdmin,
  cancelReservationSuccess,
  createReservation,
  createReservationFailure,
  createReservationSuccess,
  getReservationsByGroupId,
  getReservationsByGroupIdSuccess,
  loadAvailableSlots,
  loadAvailableSlotsFailure,
  loadAvailableSlotsSuccess,
  loadReservationConfiguration,
  loadReservationConfigurationSuccess,
  loadReservations,
  loadReservationsAdmin,
  loadReservationsAdminFailure,
  loadReservationsAdminSuccess,
  loadReservationsFailure,
  loadReservationsSuccess,
} from '../actions/reservations.actions';
import { Store } from '@ngrx/store';
import { selectDatePicked } from '../selectors/reservetions.selectors';
import { selectUser } from '../selectors/users.selectors';

@Injectable()
export class ReservationEffects {
  loadUserReservations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadReservations),
      mergeMap(() =>
        this.reservationService.getUserReservations().pipe(
          map((reservations) =>
            loadReservationsSuccess({
              reservations: reservations.reservationsDetails,
            })
          ),
          catchError((error) => of(loadReservationsFailure({ error })))
        )
      )
    )
  );

  // Return action creators
  loadReservations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createReservationSuccess, cancelReservationSuccess),
      concatMap(() => of(loadReservations()))
    )
  );

  cancelReservation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(cancelReservation),
      switchMap(({ reservationId }) =>
        this.reservationService.cancelReservation(reservationId).pipe(
          map(() => cancelReservationSuccess()),
          catchError((error) => of(loadReservationsFailure({ error })))
        )
      )
    )
  );

  cancelReservationAdmin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(cancelReservationAdmin),
      switchMap(({ reservationId }) =>
        this.reservationService.cancelReservation(reservationId).pipe(
          withLatestFrom(
            this.store.select(selectDatePicked),
            this.store.select(selectUser)
          ),
          map(([_, date]) => loadReservationsAdmin({ date })),
          catchError((error) => of(loadReservationsFailure({ error })))
        )
      )
    )
  );

  loadAvailableSlots$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadAvailableSlots),
      mergeMap((action) =>
        this.reservationService.getAvailableSlotsPerDay(action.date).pipe(
          map((response) =>
            loadAvailableSlotsSuccess({
              availableSlots: response.availableSlots.map((slot) =>
                slot.date.dateTime.slice(0, -3)
              ),
            })
          ),
          catchError((error) => of(loadAvailableSlotsFailure({ error })))
        )
      )
    )
  );

  createReservation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createReservation),
      mergeMap((action) =>
        this.reservationService.createReservation(action.selectedSlots).pipe(
          map(() => createReservationSuccess()),
          catchError((error) => of(createReservationFailure({ error })))
        )
      )
    )
  );

  loadClubReservations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadReservationsAdmin),
      mergeMap((action) =>
        this.reservationService.getClubReservations(action.date).pipe(
          map((reservations) =>
            loadReservationsAdminSuccess({
              clubReservations: reservations,
            })
          ),
          catchError((error) => of(loadReservationsAdminFailure({ error })))
        )
      )
    )
  );

  getReservationsByGroupId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getReservationsByGroupId),
      mergeMap((action) =>
        this.reservationService.getReservationsByGroupId(action.groupId).pipe(
          map((reservations) =>
            getReservationsByGroupIdSuccess({
              reservations: reservations,
            })
          ),
          catchError((error) => of(loadReservationsAdminFailure({ error })))
        )
      )
    )
  );

  loadReservationConfigurationOnUserLoadSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadReservationsSuccess),
      concatMap(() => of(loadReservationConfiguration()))
    )
  );

  loadReservationConfiguration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadReservationConfiguration),
      mergeMap(() =>
        this.reservationService.getReservationConfiguration().pipe(
          map((configuration) => {
            return loadReservationConfigurationSuccess({ configuration });
          }),
          catchError((error) => of(loadAvailableSlotsFailure({ error })))
        )
      )
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly reservationService: ReservationService,
    private readonly store: Store<any>
  ) {}
}
