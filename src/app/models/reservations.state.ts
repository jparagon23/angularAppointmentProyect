import { ClubReservations } from './ClubReservations.model';
import { GroupReservationInfo } from './GroupReservationInfo.model';
import { ReservationDetail } from './UserReservations.model';

export interface ReservationState {
  datePicked: string;
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
  groupReservationInfo: GroupReservationInfo | null;
  groupReservationLoading: boolean;
}
