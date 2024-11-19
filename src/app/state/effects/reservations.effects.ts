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
  cancelReservationAdminFailure,
  cancelReservationAdminSuccess,
  cancelReservationSuccess,
  createCancelReservationCauses,
  createCancelReservationCausesFailure,
  createCancelReservationCausesSuccess,
  createReservation,
  createReservationFailure,
  createReservationSuccess,
  deleteCancelReservationCauses,
  deleteCancelReservationCausesFailure,
  deleteCancelReservationCausesSuccess,
  getReservationsByGroupId,
  getReservationsByGroupIdSuccess,
  loadAvailableSlots,
  loadAvailableSlotsFailure,
  loadAvailableSlotsSuccess,
  loadCancelReservationCauses,
  loadCancelReservationCausesSuccess,
  loadReservationConfiguration,
  loadReservationConfigurationSuccess,
  loadReservations,
  loadReservationsAdmin,
  loadReservationsAdminFailure,
  loadReservationsAdminSuccess,
  loadReservationsFailure,
  loadReservationsSuccess,
  updateCancelReservationCauses,
  updateCancelReservationCausesFailure,
  updateCancelReservationCausesSuccess,
} from '../actions/reservations.actions';
import { Store } from '@ngrx/store';
import { selectDatePicked } from '../selectors/reservetions.selectors';
import { selectUser } from '../selectors/users.selectors';
import { AvailableSlotsResponse } from 'src/app/models/AvailableSlotInfo.model';

@Injectable()
export class ReservationEffects {
  loadUserReservations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadReservations),
      mergeMap(() =>
        this.reservationService.getUserReservations().pipe(
          map((reservations) =>
            loadReservationsSuccess({
              reservations: reservations.reservations,
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
      ofType(cancelReservationSuccess),
      switchMap(() => {
        return of(loadReservations());
      })
    )
  );

  cancelReservation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(cancelReservation),
      switchMap(({ reservationId }) =>
        this.reservationService.cancelReservation(reservationId, null).pipe(
          map(() => cancelReservationSuccess()),
          catchError((error) => of(loadReservationsFailure({ error })))
        )
      )
    )
  );

  // First Effect: Handles cancelReservationAdmin and triggers success or failure actions
  cancelReservationAdmin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(cancelReservationAdmin),
      switchMap(({ reservationId, cause }) =>
        this.reservationService.cancelReservation(reservationId, cause).pipe(
          map(() => cancelReservationAdminSuccess()), // Dispatch success action
          catchError((error) => of(cancelReservationAdminFailure({ error }))) // Dispatch failure action
        )
      )
    )
  );

  // Second Effect: Listens for success and then triggers loadReservationsAdmin, with error handling
  loadReservationsAfterCancelSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(cancelReservationAdminSuccess),
      withLatestFrom(this.store.select(selectDatePicked)),
      map(([_, date]) => loadReservationsAdmin({ date }))
    )
  );

  loadAvailableSlots$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadAvailableSlots),
      mergeMap((action) =>
        this.reservationService.getAvailableSlotsPerDay(action.date).pipe(
          map((response: AvailableSlotsResponse) =>
            loadAvailableSlotsSuccess({ availableSlots: response })
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

  loadCancellationCauses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCancelReservationCauses),
      mergeMap(() =>
        this.reservationService.getCancellationCauses().pipe(
          map((causes) => {
            return loadCancelReservationCausesSuccess({ causes });
          }),
          catchError((error) => of(loadAvailableSlotsFailure({ error })))
        )
      )
    )
  );

  deleteCancellationCause$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteCancelReservationCauses),
      mergeMap((action) =>
        this.reservationService
          .deleteCancellationCause(action.causeId.toString())
          .pipe(
            map(() => {
              return deleteCancelReservationCausesSuccess({
                causeId: action.causeId,
              });
            }),
            catchError((error) =>
              of(deleteCancelReservationCausesFailure({ error }))
            )
          )
      )
    )
  );

  createCancellationCause$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createCancelReservationCauses),
      mergeMap((action) =>
        this.reservationService
          .createCancellationCause(action.description)
          .pipe(
            map((cause) => {
              return createCancelReservationCausesSuccess({ cause });
            }),
            catchError((error) =>
              of(createCancelReservationCausesFailure({ error }))
            )
          )
      )
    )
  );

  updateCancellationCause$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateCancelReservationCauses),
      mergeMap((action) =>
        this.reservationService
          .updateCancellationCause(action.causeId, action.description)
          .pipe(
            map((cause) => {
              return updateCancelReservationCausesSuccess({ cause });
            }),
            catchError((error) =>
              of(updateCancelReservationCausesFailure({ error }))
            )
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
