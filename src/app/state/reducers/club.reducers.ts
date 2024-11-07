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
} from '../actions/club.actions';
import { createReducer, on } from '@ngrx/store';
import { logout } from '../actions/auth.actions';
export interface ClubState {
  clubUsers: ClubUser[];
  loadingClubUsers: boolean;
  reservationCreated: boolean;
  reservationCreatedFailure: boolean;
  loadingCreateReservation: boolean;
  error: any;
}

export const initialState: ClubState = {
  clubUsers: [],
  loadingClubUsers: false,
  error: null,
  reservationCreated: false,
  loadingCreateReservation: false,
  reservationCreatedFailure: false,
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
  on(logout, (state: ClubState) => initialState)
);
