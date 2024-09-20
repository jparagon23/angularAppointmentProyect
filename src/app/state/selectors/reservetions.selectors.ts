import { ReservationState } from 'src/app/models/reservations.state';
import { AppState } from '../app.state';
import { createSelector } from '@ngrx/store';

export const selectReservationsFeature = (state: AppState) =>
  state.reservations;

export const selectListReservations = createSelector(
  selectReservationsFeature,
  (state: ReservationState) => state.reservations
);
export const selectReservationLoading = createSelector(
  selectReservationsFeature,
  (state: ReservationState) => state.loading
);

export const selectReservationSelected = createSelector(
  selectReservationsFeature,
  (state: ReservationState) => state.reservationSelected
);
