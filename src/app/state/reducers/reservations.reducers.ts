import { createReducer, on } from '@ngrx/store';
import { ReservationDetail } from 'src/app/models/UserReservations.model';
import {
  loadReservations,
  loadReservationsFailure,
  loadReservationsSuccess,
} from '../actions/reservations.actions';
import { ReservationState } from 'src/app/models/reservations.state';

export const initialState: ReservationState = {
  loading: false,
  reservations: [],
};

export const reservationsReducer = createReducer(
  initialState,
  on(loadReservations, (state) => ({ ...state, loading: true })),
  on(loadReservationsSuccess, (state, { reservations }) => ({
    ...state,
    loading: false,
    reservations,
  })),
  on(loadReservationsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
