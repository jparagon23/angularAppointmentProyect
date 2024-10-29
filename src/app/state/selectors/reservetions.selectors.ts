import { ReservationState } from 'src/app/models/reservations.state';
import { AppState } from '../app.state';
import { createSelector } from '@ngrx/store';
import { GroupReservationInfo } from 'src/app/models/GroupReservationInfo.model';

export const selectReservationsFeature = (state: AppState) =>
  state.reservations;

export const selectListReservations = createSelector(
  selectReservationsFeature,
  (state: ReservationState) => state.reservations
);
export const selectReservationLoading = createSelector(
  selectReservationsFeature,
  (state: ReservationState) => state.loadingUserReservations
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
export const selectLoadingAvailableSlots = createSelector(
  selectReservationsFeature,
  (state: ReservationState) => state.loadingAvailableSlots
);

export const selectGetAvailableSlotsFailure = createSelector(
  selectReservationsFeature,
  (state: ReservationState) => state.getAvailableSlotsFailure
);
// Selector para verificar si está cargando
export const selectAvailableSlotsLoading = createSelector(
  selectReservationsFeature,
  (state: ReservationState) => state.loadingUserReservations
);

export const selectCreateReservationLoading = createSelector(
  selectReservationsFeature,
  (state: ReservationState) => state.createReservationLoading
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

export const selectDatePicked = createSelector(
  selectReservationsFeature,
  (state: ReservationState) => state.datePicked
);

export const selectGroupReservationInfo = createSelector(
  selectReservationsFeature,
  (state: ReservationState) => state.groupReservationInfo
);

export const selectClubReservationsLoading = createSelector(
  selectReservationsFeature,
  (state: ReservationState) => state.clubReservationsLoading
);

//----------------cancel reservation
export const selectCancelReservationLoading = createSelector(
  selectReservationsFeature,
  (state: ReservationState) => state.cancelReservationLoading
);

export const selectCancelReservationSuccess = createSelector(
  selectReservationsFeature,
  (state: ReservationState) => state.cancelReservationSuccess
);

export const selectCancelReservationFailure = createSelector(
  selectReservationsFeature,
  (state: ReservationState) => state.cancelReservationFailure
);
//----------------cancel reservation

export const selectMatchingReservationId = (hour: string) =>
  createSelector(
    selectGroupReservationInfo,
    (groupReservationInfo: GroupReservationInfo | null) => {
      if (
        groupReservationInfo &&
        Array.isArray(groupReservationInfo.individualReservations)
      ) {
        const matchingReservation =
          groupReservationInfo.individualReservations.find(
            (res) => new Date(res.dateTime).getHours() === parseInt(hour, 10)
          );
        return matchingReservation
          ? matchingReservation.reservationId.toString()
          : null;
      }
      return null;
    }
  );

export const selectReservationConfiguration = createSelector(
  selectReservationsFeature,
  (state: ReservationState) => state.reservationConfiguration
);
