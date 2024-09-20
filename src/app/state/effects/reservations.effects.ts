import { ReservationDetail } from './../../models/UserReservations.model';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, mergeMap, of, switchMap } from 'rxjs';
import { ReservationService } from 'src/app/services/reservation.service';
import {
  cancelReservation,
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

  loadReservationsAfterUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUserSuccess), // Espera hasta que loadUserSuccess sea despachado
      concatMap((action) => [loadReservations()]) // Luego despacha loadReservations
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

  constructor(
    private actions$: Actions,
    private reservationService: ReservationService
  ) {}
}
