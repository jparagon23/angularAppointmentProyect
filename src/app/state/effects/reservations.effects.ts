import { ReservationDetail } from './../../models/UserReservations.model';
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
  createReservation,
  createReservationFailure,
  createReservationSuccess,
  getReservationsByGroupId,
  getReservationsByGroupIdSuccess,
  loadAvailableSlots,
  loadAvailableSlotsFailure,
  loadAvailableSlotsSuccess,
  loadReservations,
  loadReservationsAdmin,
  loadReservationsAdminFailure,
  loadReservationsAdminSuccess,
  loadReservationsFailure,
  loadReservationsSuccess,
} from '../actions/reservations.actions';
import { loadUserSuccess } from '../actions/users.actions';
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

  loadReservations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createReservationSuccess), // Escucha tanto createReservationSuccess como loadUserSuccess
      concatMap(() => [loadReservations()]) // Luego despacha loadReservations
    )
  );

  cancelReservation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(cancelReservation),
      switchMap(({ reservationId }) =>
        this.reservationService.cancelReservation(reservationId).pipe(
          // Si es exitoso, carga nuevamente las reservas
          map(() => loadReservations()),
          // Maneja el error si ocurre algún problema
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
          // Combina la acción con el estado actual para obtener `date` y `club`
          withLatestFrom(
            this.store.select(selectDatePicked),
            this.store.select(selectUser)
          ),
          // Si es exitoso, carga nuevamente las reservas
          map(([action, date, club]) =>
            loadReservationsAdmin({ date, club: club!.userAdminClub })
          ),
          // Maneja el error si ocurre algún problema
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

  // Crear reserva
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
        this.reservationService
          .getClubReservations(action.date, action.club)
          .pipe(
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

  constructor(
    private actions$: Actions,
    private reservationService: ReservationService,
    private store: Store<any>
  ) {}
}
