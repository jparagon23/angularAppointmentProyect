import { ReservationDetail } from './UserReservations.model';

export interface ReservationState {
  loading: boolean;
  reservations: ReservationDetail[];
  reservationSelected: ReservationDetail;
  reservationCanceled: boolean;
}
