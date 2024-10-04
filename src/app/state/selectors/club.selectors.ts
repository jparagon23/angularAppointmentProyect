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
