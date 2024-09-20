import { createAction, props } from '@ngrx/store';
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

export const cancelReservation = createAction(
  '[Reservations] Cancel Reservation',
  props<{ reservation: ReservationDetail }>()
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
