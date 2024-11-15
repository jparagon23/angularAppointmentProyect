import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ClubState } from '../reducers/club.reducers';

export const selectClubState = createFeatureSelector<ClubState>('club');

export const selectClubUsers = createSelector(
  selectClubState,
  (state: ClubState) => state.clubUsers
);

export const selectLoadingClubUsers = createSelector(
  selectClubState,
  (state: ClubState) => state.loadingClubUsers
);

export const selectReservationCreated = createSelector(
  selectClubState,
  (state: ClubState) => state.reservationCreated
);

export const selectClubError = createSelector(
  selectClubState,
  (state: ClubState) => state.error
);

export const loadingCreateReservation = createSelector(
  selectClubState,
  (state: ClubState) => state.loadingCreateReservation
);

export const reservationCreatedFailure = createSelector(
  selectClubState,
  (state: ClubState) => state.reservationCreatedFailure
);

export const selectCreateReservationAdminSuccess = createSelector(
  selectClubState,
  (state: ClubState) => state.reservationCreated
);
