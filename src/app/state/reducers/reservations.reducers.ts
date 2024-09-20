import { createReducer, on } from '@ngrx/store';
import { ReservationDetail } from 'src/app/models/UserReservations.model';
import {
  cancelReservation,
  createReservation,
  createReservationFailure,
  createReservationSuccess,
  loadAvailableSlots,
  loadAvailableSlotsFailure,
  loadAvailableSlotsSuccess,
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
  availableSlots: [],
  loadingAvailableSlots: false,
  error: undefined
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
  })),
  // Cargando los espacios disponibles
  on(loadAvailableSlots, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  // Cargar espacios exitosamente
  on(loadAvailableSlotsSuccess, (state, { availableSlots }) => ({
    ...state,
    availableSlots,
    loading: false,
  })),

  // Error al cargar espacios
  on(loadAvailableSlotsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Crear reserva
  on(createReservation, (state, { selectedSlots }) => ({
    ...state,
    selectedSlots,
    loading: true,
    error: null,
  })),

  // Reserva creada exitosamente
  on(createReservationSuccess, (state) => ({
    ...state,
    loading: false,
    selectedSlots: []
  })),

  // Error al crear reserva
  on(createReservationFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))

);
