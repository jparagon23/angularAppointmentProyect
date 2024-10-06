import { ClubReservations } from './../../models/ClubReservations.model';
import { ClubUser } from 'src/app/models/clubUsers.model';
import {
  getClubUserByNameOrId,
  getClubUserByNameOrIdSuccess,
  getClubUserByNameOrIdFailure,
  createReservationAdmin,
  createReservationAdminSuccess,
  createReservationAdminFailure,
  resetReservationCreated,
} from '../actions/club.actions';
import { createReducer, on } from '@ngrx/store';
import { logout } from '../actions/auth.actions';
export interface clubState {
  clubUsers: ClubUser[];
  loadingClubUsers: boolean;
  reservationCreated: boolean;
  reservationCreatedFailure: boolean;
  loadingCreateReservation: boolean;
  error: any;
}

export const initialState: clubState = {
  clubUsers: [],
  loadingClubUsers: false,
  error: null,
  reservationCreated: false,
  loadingCreateReservation: false,
  reservationCreatedFailure: false,
};

export const clubReducer = createReducer(
  initialState,
  on(getClubUserByNameOrId, (state: clubState) => ({
    ...state,
    loadingClubUsers: true,
  })),
  on(getClubUserByNameOrIdSuccess, (state: clubState, { users }) => ({
    ...state,
    clubUsers: users,
    loadingClubUsers: false,
  })),
  on(getClubUserByNameOrIdFailure, (state: clubState, { error }) => ({
    ...state,
    loadingClubUsers: false,
    error,
  })),
  on(createReservationAdmin, (state: clubState) => ({
    ...state,
    reservationCreated: false,
    loadingCreateReservation: true,
  })),
  on(createReservationAdminSuccess, (state: clubState) => ({
    ...state,
    reservationCreated: true,
    loadingCreateReservation: false,
  })),
  on(createReservationAdminFailure, (state: clubState, { error }) => ({
    ...state,
    reservationCreated: false,
    loadingCreateReservation: false,
    reservationCreatedFailure: true,
    error,
  })),
  on(resetReservationCreated, (state: clubState) => ({
    ...state,
    reservationCreated: false, // Restablecer reservationCreated a false
  })),
  on(logout, (state: clubState) => initialState)
);
