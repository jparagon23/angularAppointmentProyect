import { createReducer, on } from '@ngrx/store';
import { ReservationDetail } from 'src/app/models/UserReservations.model';
import {
  cancelReservation,
  cancelReservationAdmin,
  createReservation,
  createReservationFailure,
  createReservationSuccess,
  getReservationsByGroupId,
  getReservationsByGroupIdFailure,
  getReservationsByGroupIdSuccess,
  loadAvailableSlots,
  loadAvailableSlotsFailure,
  loadAvailableSlotsSuccess,
  loadReservations,
  loadReservationsAdmin,
  loadReservationsAdminFailure,
  loadReservationsAdminSuccess,
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
  error: null,
  createReservationSuccess: false,
  createReservationFailure: false,
  clubReservations: null,
  clubReservationsLoading: false,
  clubReservationsError: false,
  clubReservationsSuccess: false,
  datePicked: '',
  groupReservationInfo: null,
  groupReservationLoading: false,
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
  on(cancelReservation, (state) => ({
    ...state,
    reservationCanceled: true,
  })),
  on(cancelReservationAdmin, (state) => ({
    ...state,
    reservationCanceled: true,
  })),
  // Cargando los espacios disponibles
  on(loadAvailableSlots, (state) => ({
    ...state,
    loadingAvailableSlots: true,
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
  })),

  on(loadReservationsAdmin, (state, { date }) => ({
    ...state,
    datePicked: date,
    clubReservationsLoading: true,
    clubReservationsError: false,
    clubReservationsSuccess: false,
  })),

  on(loadReservationsAdminSuccess, (state, { clubReservations }) => ({
    ...state,
    clubReservations: clubReservations,
    clubReservationsLoading: false,
    clubReservationsError: false,
    clubReservationsSuccess: true,
  })),

  on(loadReservationsAdminFailure, (state, { error }) => ({
    ...state,
    clubReservations: null,
    clubReservationsLoading: false,
    clubReservationsError: true,
    clubReservationsSuccess: false,
    error,
  })),

  on(getReservationsByGroupId, (state) => ({
    ...state,
    groupReservationLoading: true,
  })),

  on(getReservationsByGroupIdSuccess, (state, { reservations }) => ({
    ...state,
    groupReservationInfo: reservations,
    groupReservationLoading: false,
  })),
  on(getReservationsByGroupIdFailure, (state, { error }) => ({
    ...state,
    groupReservationInfo: null,
    groupReservationLoading: false,
    error,
  }))
);
