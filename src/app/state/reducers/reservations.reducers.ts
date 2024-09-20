import { createReducer, on } from '@ngrx/store';
import { ReservationDetail } from 'src/app/models/UserReservations.model';
import {
  cancelReservation,
  loadReservations,
  loadReservationsFailure,
  loadReservationsSuccess,
  selectReservation,
} from '../actions/reservations.actions';
import { ReservationState } from 'src/app/models/reservations.state';

export const initialState: ReservationState = {
  loading: false,
  reservations: [],
  reservationSelected: {
    groupId: '',
    date: '',
    initialHour: '',
    endHour: '',
    groupCourtId: [],
    individualReservationsId: [],
    club: '',
  },
  reservationCanceled: false,
};

export const reservationsReducer = createReducer(
  initialState,
  on(loadReservations, (state) => ({ ...state, loading: true })),
  on(loadReservationsSuccess, (state, { reservations }) => ({
    ...state,
    loading: false,
    reservations,
    reservationCanceled: false,
  })),
  on(loadReservationsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(selectReservation, (state, { reservation }) => ({
    ...state,
    reservationSelected: reservation,
  })),
  on(cancelReservation, (state, { reservation }) => ({
    ...state,
    reservationCanceled: true,
  }))
);
