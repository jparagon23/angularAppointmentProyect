import { ReservationDetail } from './../../models/UserReservations.model';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, mergeMap, of, switchMap } from 'rxjs';
import { ReservationService } from 'src/app/services/reservation.service';
import {
  cancelReservation,
  createReservation,
  createReservationFailure,
  createReservationSuccess,
  loadAvailableSlots,
  loadAvailableSlotsFailure,
  loadAvailableSlotsSuccess,
  loadReservations,
  loadReservationsFailure,
  loadReservationsSuccess,
} from '../actions/reservations.actions';
import { loadUserSuccess } from '../actions/users.actions';

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
      switchMap(({ reservation }) =>
        this.reservationService.cancelReservation(reservation).pipe(
          // Si es exitoso, carga nuevamente las reservas
          map(() => loadReservations()),
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

  constructor(
    private actions$: Actions,
    private reservationService: ReservationService
  ) {}
}
