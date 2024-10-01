import { ClubReservations } from './ClubReservations.model';
import { ReservationDetail } from './UserReservations.model';

export interface ReservationState {
  loading: boolean;
  reservations: ReservationDetail[];
  reservationSelected: ReservationDetail;
  reservationCanceled: boolean;
  availableSlots: string[];
  loadingAvailableSlots: boolean;
  error: any;
  createReservationSuccess: boolean;
  createReservationFailure: boolean;
  clubReservations: ClubReservations | null;
  clubReservationsLoading: boolean;
  clubReservationsError: boolean;
  clubReservationsSuccess: boolean;
}
