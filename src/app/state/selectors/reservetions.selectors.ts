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

// Selector para obtener espacios disponibles
export const selectAvailableSlots = createSelector(
  selectReservationsFeature,
  (state: ReservationState) => state.availableSlots
);

// Selector para verificar si está cargando
export const selectAvailableSlotsLoading = createSelector(
  selectReservationsFeature,
  (state: ReservationState) => state.loading
);

export const selectCreateReservationSuccess = createSelector(
  selectReservationsFeature,
  (state: ReservationState) => state.createReservationSuccess
);

export const selectCreateReservationFailure = createSelector(
  selectReservationsFeature,
  (state: ReservationState) => state.createReservationFailure
);

export const selectClubReservations = createSelector(
  selectReservationsFeature,
  (state: ReservationState) => state.clubReservations
);
