import { ClubUser } from 'src/app/models/clubUsers.model';
import {
  getClubUserByNameOrId,
  getClubUserByNameOrIdSuccess,
  getClubUserByNameOrIdFailure,
  createReservationAdmin,
  createReservationAdminSuccess,
  createReservationAdminFailure,
} from '../actions/club.actions';
import { createReducer, on } from '@ngrx/store';
export interface clubState {
  clubUsers: ClubUser[];
  loadingClubUsers: boolean;
  reservationCreated: boolean;
  loadingCreateReservation: boolean;
  error: any;
}

export const initialState: clubState = {
  clubUsers: [],
  loadingClubUsers: false,
  error: null,
  reservationCreated: false,
  loadingCreateReservation: false,
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
    error,
  }))
);