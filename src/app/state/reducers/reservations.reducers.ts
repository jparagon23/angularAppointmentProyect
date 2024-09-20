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
  error: undefined,
  createReservationSuccess: false,
  createReservationFailure: false
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
    loadingAvailableSlots: false,
  })),

  // Error al cargar espacios
  on(loadAvailableSlotsFailure, (state, { error }) => ({
    ...state,
    loadingAvailableSlots: false,
    error,
  })),

  // Crear reserva
  // Crear reserva: iniciar la creación de la reserva
  on(createReservation, (state, { selectedSlots }) => ({
    ...state,
    selectedSlots,
    loading: true,
    createReservationSuccess: false,
    createReservationFailure: false, 
    error: null,
  })),

  on(createReservationSuccess, (state) => ({
    ...state,
    loading: false,
    selectedSlots: [],
    createReservationSuccess: true, 
    createReservationFailure: false, 
  })),

  // Error al crear reserva
  on(createReservationFailure, (state, { error }) => ({
    ...state,
    loading: false,
    createReservationSuccess: false,
    createReservationFailure: true, 
    error,
  }))

);
