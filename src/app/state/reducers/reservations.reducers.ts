import {
  cancelReservation,
  cancelReservationFailure,
  cancelReservationSuccess,
  loadReservationConfiguration,
  loadReservationConfigurationFailure,
  loadReservationConfigurationSuccess,
  resetAvailableSlots,
  resetCancelReservationState,
} from 'src/app/state/actions/reservations.actions';
import { createReducer, on } from '@ngrx/store';
import {
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
  resetCreateReservation,
  selectReservation,
} from '../actions/reservations.actions';
import { ReservationState } from 'src/app/models/reservations.state';
import { logout } from '../actions/auth.actions';

export const initialState: ReservationState = {
  loadingUserReservations: false,
  reservations: [],
  reservationSelected: {
    groupId: '',
    date: '',
    initialHour: '',
    endHour: '',
    groupCourtIds: [],
    groupCourtNames: [],
    individualReservations: [],
    clubName: '',
  },
  cancelReservationLoading: false,
  cancelReservationSuccess: false,
  cancelReservationFailure: false,
  availableSlots: null,
  loadingAvailableSlots: false,
  getAvailableSlotsSuccess: false,
  getAvailableSlotsFailure: false,
  error: null,
  createReservationLoading: false,
  createReservationSuccess: false,
  createReservationFailure: false,
  clubReservations: null,
  clubReservationsLoading: false,
  clubReservationsError: false,
  clubReservationsSuccess: false,
  datePicked: '',
  groupReservationInfo: null,
  groupReservationLoading: false,

  loadingReservationConfiguration: false,
  reservationConfigurationSuccess: false,
  reservationConfigurationFailure: false,
  reservationConfiguration: null,
};

export const reservationsReducer = createReducer(
  initialState,
  on(loadReservations, (state) => ({
    ...state,
    loadingUserReservations: true,
  })),
  on(loadReservationsSuccess, (state, { reservations }) => ({
    ...state,
    loadingUserReservations: false,
    reservations,
  })),
  on(loadReservationsFailure, (state, { error }) => ({
    ...state,
    loadingUserReservations: false,
    error,
  })),

  on(selectReservation, (state, { reservation }) => ({
    ...state,
    reservationSelected: reservation,
  })),
  on(cancelReservation, (state) => ({
    ...state,
    cancelReservationLoading: true,
  })),
  on(cancelReservationSuccess, (state) => ({
    ...state,
    cancelReservationLoading: false,
    cancelReservationSuccess: true,
  })),
  on(cancelReservationFailure, (state) => ({
    ...state,
    cancelReservationLoading: false,
    cancelReservationFailure: true,
  })),
  on(resetCancelReservationState, (state) => ({
    ...state,
    cancelReservationLoading: false,
    cancelReservationSuccess: false,
    cancelReservationFailure: false,
  })),

  on(cancelReservationAdmin, (state) => ({
    ...state,
    reservationCanceled: true,
  })),
  // Cargando los espacios disponibles
  on(loadAvailableSlots, (state) => ({
    ...state,
    loadingAvailableSlots: true,
    getAvailableSlotsSuccess: false,
    getAvailableSlotsFailure: false,
  })),

  // Cargar espacios exitosamente
  on(loadAvailableSlotsSuccess, (state, { availableSlots }) => ({
    ...state,
    availableSlots,
    loadingAvailableSlots: false,
    getAvailableSlotsSuccess: true,
  })),

  // Error al cargar espacios
  on(loadAvailableSlotsFailure, (state, { error }) => ({
    ...state,
    loadingAvailableSlots: false,
    getAvailableSlotsFailure: true,
    error,
  })),
  on(resetAvailableSlots, (state) => ({
    ...state,
    loadingAvailableSlots: false,
    getAvailableSlotsSuccess: false,
    getAvailableSlotsFailure: false,
  })),

  // Crear reserva
  // Crear reserva: iniciar la creación de la reserva
  on(createReservation, (state, { selectedSlots }) => ({
    ...state,
    selectedSlots,
    createReservationLoading: true,
    createReservationSuccess: false,
    createReservationFailure: false,
    error: null,
  })),

  on(createReservationSuccess, (state) => ({
    ...state,
    createReservationLoading: false,
    selectedSlots: [],
    createReservationSuccess: true,
    createReservationFailure: false,
  })),

  // Error al crear reserva
  on(createReservationFailure, (state, { error }) => ({
    ...state,
    createReservationLoading: false,
    createReservationSuccess: false,
    createReservationFailure: true,
    error,
  })),

  on(resetCreateReservation, (state) => ({
    ...state,
    createReservationLoading: false,
    createReservationSuccess: false,
    createReservationFailure: false,
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
  })),

  on(loadReservationConfiguration, (state) => ({
    ...state,
    loadingReservationConfiguration: true,
    reservationConfigurationSuccess: false,
    reservationConfigurationFailure: false,
  })),
  on(loadReservationConfigurationSuccess, (state, { configuration }) => ({
    ...state,
    reservationConfiguration: configuration,
    loadingReservationConfiguration: false,
    reservationConfigurationSuccess: true,
  })),
  on(loadReservationConfigurationFailure, (state, { error }) => ({
    ...state,
    reservationConfiguration: null,
    loadingReservationConfiguration: false,
    reservationConfigurationFailure: true,
    error,
  })),

  on(logout, (state) => initialState)
);
