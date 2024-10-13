import { createAction, props } from '@ngrx/store';
import { ClubReservations } from 'src/app/models/ClubReservations.model';
import { GroupReservationInfo } from 'src/app/models/GroupReservationInfo.model';
import { ReservationDetail } from 'src/app/models/UserReservations.model';

export const loadReservations = createAction(
  '[Reservations] Load Reservations'
);
export const loadReservationsSuccess = createAction(
  '[Reservations] Load Reservations Success',
  props<{ reservations: ReservationDetail[] }>()
);
export const loadReservationsFailure = createAction(
  '[Reservations] Load Reservations Failure',
  props<{ error: any }>()
);

export const selectReservation = createAction(
  '[Reservations] Select Reservation',
  props<{ reservation: ReservationDetail }>()
);

//--- Cancel reservation

export const cancelReservation = createAction(
  '[Reservations] Cancel Reservation',
  props<{ reservationId: string }>()
);

export const cancelReservationSuccess = createAction(
  '[Reservations] Cancel Reservation Success'
);

export const cancelReservationFailure = createAction(
  '[Reservations] Cancel Reservation Failure',
  props<{ error: any }>()
);

export const resetCancelReservationState = createAction(
  '[Reservations] Reset Cancel Reservation'
);

//--- Cancel reservation

export const cancelReservationAdmin = createAction(
  '[Admin Dashboard] Cancel Reservation from admin',
  props<{ reservationId: string }>()
);

// Acción para cargar espacios disponibles
export const loadAvailableSlots = createAction(
  '[Reservation] Load Available Slots',
  props<{ date: string }>()
);

// Acción para espacios disponibles cargados correctamente
export const loadAvailableSlotsSuccess = createAction(
  '[Reservation] Load Available Slots Success',
  props<{ availableSlots: string[] }>()
);

// Acción para error al cargar espacios
export const loadAvailableSlotsFailure = createAction(
  '[Reservation] Load Available Slots Failure',
  props<{ error: any }>()
);

// Acción para crear una reserva
export const createReservation = createAction(
  '[Reservation] Create Reservation',
  props<{ selectedSlots: string[] }>()
);

// Acción cuando la reserva se ha creado exitosamente
export const createReservationSuccess = createAction(
  '[Reservation] Create Reservation Success'
);

// Acción para manejar errores al crear reserva
export const createReservationFailure = createAction(
  '[Reservation] Create Reservation Failure',
  props<{ error: any }>()
);

export const resetCreateReservation = createAction(
  '[Reservation] Reset Create Reservation'
);

export const loadReservationsAdmin = createAction(
  '[Admin Dashboard] Load Reservations Admin',
  props<{ date: string }>()
);

export const loadReservationsAdminSuccess = createAction(
  '[Admin Dashboard] Load Reservations Admin Success',
  props<{ clubReservations: ClubReservations }>()
);

export const loadReservationsAdminFailure = createAction(
  '[Admin Dashboard] Load Reservations Admin Failure',
  props<{ error: any }>()
);

export const getReservationsByGroupId = createAction(
  '[Admin Dashboard] Get Reservations By Group Id',
  props<{ groupId: string }>()
);

export const getReservationsByGroupIdSuccess = createAction(
  '[Admin Dashboard] Get Reservations By Group Id Success',
  props<{ reservations: GroupReservationInfo }>()
);

export const getReservationsByGroupIdFailure = createAction(
  '[Admin Dashboard] Get Reservations By Group Id Failure',
  props<{ error: any }>()
);
