import { createSelector, createFeatureSelector, select } from '@ngrx/store';
import { ClubState } from './club.reducers';

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

export const selectSelectedClubDate = createSelector(
  selectClubState,
  (state: ClubState) => state.selectedClubDate
);

export const selectUpdateReservationLoader = createSelector(
  selectClubState,
  (state: ClubState) => state.updateReservationLoading
);

export const selectUpdateReservationSuccess = createSelector(
  selectClubState,
  (state: ClubState) => state.updateReservationSuccess
);

export const selectUpdateReservationFailure = createSelector(
  selectClubState,
  (state: ClubState) => state.updateReservationFailure
);

export const selectClubPageInfo = createSelector(
  selectClubState,
  (state: ClubState) => ({
    last10ClubMatches: state.lastClubMatches,
    loadingClubMatches: state.loadingClubMatches,
    clubRanking: state.clubRanking,
    loadingClubRanking: state.loadingClubRanking,
  })
);
