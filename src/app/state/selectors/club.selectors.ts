import { createSelector, createFeatureSelector } from '@ngrx/store';
import { clubState } from '../reducers/club.reducers';

export const selectClubState = createFeatureSelector<clubState>('club');

export const selectClubUsers = createSelector(
  selectClubState,
  (state: clubState) => state.clubUsers
);

export const selectLoadingClubUsers = createSelector(
  selectClubState,
  (state: clubState) => state.loadingClubUsers
);

export const selectReservationCreated = createSelector(
  selectClubState,
  (state: clubState) => state.reservationCreated
);

export const selectClubError = createSelector(
  selectClubState,
  (state: clubState) => state.error
);

export const loadingCreateReservation = createSelector(
  selectClubState,
  (state: clubState) => state.loadingCreateReservation
);

export const reservationCreatedFailure = createSelector(
  selectClubState,
  (state: clubState) => state.reservationCreatedFailure
);
