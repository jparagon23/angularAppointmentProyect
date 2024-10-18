import { ClubAvailability } from './ClubAvalability.model';
import { ClubReservations } from './ClubReservations.model';
import { GroupReservationInfo } from './GroupReservationInfo.model';
import { ReservationDetail } from './UserReservations.model';

export interface ReservationState {
  datePicked: string;
  loadingUserReservations: boolean;
  reservations: ReservationDetail[];
  reservationSelected: ReservationDetail;
  cancelReservationLoading: boolean;
  cancelReservationSuccess: boolean;
  cancelReservationFailure: boolean;
  availableSlots: string[];
  loadingAvailableSlots: boolean;
  getAvailableSlotsSuccess: boolean;
  getAvailableSlotsFailure: boolean;
  error: any;
  createReservationSuccess: boolean;
  createReservationFailure: boolean;
  clubReservations: ClubReservations | null;
  createReservationLoading: boolean;
  clubReservationsLoading: boolean;
  clubReservationsError: boolean;
  clubReservationsSuccess: boolean;
  groupReservationInfo: GroupReservationInfo | null;
  groupReservationLoading: boolean;

  loadingReservationConfiguration: boolean;
  reservationConfigurationSuccess: boolean;
  reservationConfigurationFailure: boolean;
  reservationConfiguration: ClubAvailability | null;
}
