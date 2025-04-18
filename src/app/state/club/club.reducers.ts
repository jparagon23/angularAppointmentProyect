import { update } from 'lodash';
import { ClubUser } from 'src/app/models/clubUsers.model';
import {
  getClubUserByNameOrId,
  getClubUserByNameOrIdSuccess,
  getClubUserByNameOrIdFailure,
  createReservationAdmin,
  createReservationAdminSuccess,
  createReservationAdminFailure,
  resetReservationCreated,
  resetClubUsers,
  selectedClubDate,
  updateReservationAdmin,
  updateReservationAdminFailure,
  updateReservationAdminSuccess,
  loadLast10ClubMatches,
  loadLast10ClubMatchesSuccess,
  loadLast10ClubMatchesFailure,
  loadClubRanking,
  loadClubRankingSuccess,
  loadClubRankingFailure,
} from '../club/club.actions';
import { createReducer, on } from '@ngrx/store';
import { logout } from '../actions/auth.actions';
import { UserMatch } from 'src/app/models/events/UserMatch.model';
import { GeneralRanking } from 'src/app/models/events/RankingInfo.model';
export interface ClubState {
  clubUsers: ClubUser[];
  loadingClubUsers: boolean;
  reservationCreated: boolean;
  reservationCreatedFailure: boolean;
  loadingCreateReservation: boolean;
  error: any;
  selectedClubDate: string;
  updateReservationLoading: boolean;
  updateReservationSuccess: boolean;
  updateReservationFailure: boolean;
  lastClubMatches: UserMatch[];
  loadingClubMatches: boolean;
  clubRanking: GeneralRanking;
  loadingClubRanking: boolean;
}

export const initialState: ClubState = {
  clubUsers: [],
  loadingClubUsers: false,
  error: null,
  reservationCreated: false,
  loadingCreateReservation: false,
  reservationCreatedFailure: false,
  selectedClubDate: '',
  updateReservationLoading: true,
  updateReservationSuccess: false,
  updateReservationFailure: false,
  lastClubMatches: [],
  loadingClubMatches: false,
  clubRanking: {
    singleRanking: [],
    doublesRanking: [],
  },
  loadingClubRanking: false,
};

export const clubReducer = createReducer(
  initialState,
  on(getClubUserByNameOrId, (state: ClubState) => ({
    ...state,
    loadingClubUsers: true,
  })),
  on(getClubUserByNameOrIdSuccess, (state: ClubState, { users }) => ({
    ...state,
    clubUsers: users,
    loadingClubUsers: false,
  })),
  on(getClubUserByNameOrIdFailure, (state: ClubState, { error }) => ({
    ...state,
    loadingClubUsers: false,
    error,
  })),
  on(createReservationAdmin, (state: ClubState) => ({
    ...state,
    reservationCreated: false,
    loadingCreateReservation: true,
  })),
  on(createReservationAdminSuccess, (state: ClubState) => ({
    ...state,
    reservationCreated: true,
    loadingCreateReservation: false,
  })),
  on(createReservationAdminFailure, (state: ClubState, { error }) => ({
    ...state,
    reservationCreated: false,
    loadingCreateReservation: false,
    reservationCreatedFailure: true,
    error,
  })),
  on(resetReservationCreated, (state: ClubState) => ({
    ...state,
    reservationCreated: false,
    reservationCreatedFailure: false, // Restablecer reservationCreated a false
  })),
  on(resetClubUsers, (state: ClubState) => ({
    ...state,
    clubUsers: [],
  })),
  on(logout, (state: ClubState) => initialState),
  on(selectedClubDate, (state: ClubState, { date }) => ({
    ...state,
    selectedClubDate: date,
  })),
  on(updateReservationAdmin, (state: ClubState) => ({
    ...state,
    updateReservationLoading: true,
    updateReservationSuccess: false,
    updateReservationFailure: false,
  })),
  on(updateReservationAdminSuccess, (state: ClubState) => ({
    ...state,
    updateReservationLoading: false,
    updateReservationSuccess: true,
  })),
  on(updateReservationAdminFailure, (state: ClubState) => ({
    ...state,
    updateReservationLoading: false,
    updateReservationFailure: true,
  })),
  on(loadLast10ClubMatches, (state: ClubState) => ({
    ...state,
    loadingClubMatches: true,
  })),
  on(loadLast10ClubMatchesSuccess, (state: ClubState, { matches }) => ({
    ...state,
    lastClubMatches: matches,
    loadingClubMatches: false,
  })),
  on(loadLast10ClubMatchesFailure, (state: ClubState, { error }) => ({
    ...state,
    loadingClubMatches: false,
    error,
  })),
  on(loadClubRanking, (state: ClubState) => ({
    ...state,
    loadingClubRanking: true,
  })),
  on(loadClubRankingSuccess, (state: ClubState, { ranking }) => ({
    ...state,
    clubRanking: ranking,
    loadingClubRanking: false,
  })),
  on(loadClubRankingFailure, (state: ClubState, { error }) => ({
    ...state,
    loadingClubRanking: false,
    error,
  }))
);
