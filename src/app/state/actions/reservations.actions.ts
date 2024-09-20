import { createAction, props } from '@ngrx/store';
import { ReservationDetail } from 'src/app/models/UserReservations.model';

export const loadReservations = createAction(
  '[Reservations] Load Reservations'
);
export const loadReservationsSuccess = createAction(
  '[Reservations] Load Reservations Success',
  props<{ reservations: ReservationDetail[] }>()
);
export const loadReservationsFailure = createAction(
  '[Reservations] Load Reservations Failure',
  props<{ error: any }>()
);

export const selectReservation = createAction(
  '[Reservations] Select Reservation',
  props<{ reservation: ReservationDetail }>()
);

export const cancelReservation = createAction(
  '[Reservations] Cancel Reservation',
  props<{ reservation: ReservationDetail }>()
);
