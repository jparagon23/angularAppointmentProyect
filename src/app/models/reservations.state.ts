import { AvailableSlotsResponse } from './AvailableSlotInfo.model';
import { CancellationCause } from './CancellationCause.model';
import { CancellationClubCauses } from './CancellationClubCauses.model';
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
  availableSlots: AvailableSlotsResponse | null;
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

  loadingCauses: boolean;
  cancellationCausesSuccess: boolean;
  cancellationCausesFailure: boolean;
  cancelationCauses: CancellationClubCauses[];

  deleteCancelReservationLoading: boolean;
  deleteCancelReservationSuccess: boolean;
  deleteCancelReservationFailure: boolean;

  createCancelReservationLoading: boolean;
  createCancelReservationSuccess: boolean;
  createCancelReservationFailure: boolean;

  updateCancelReservationLoading: boolean;
  updateCancelReservationSuccess: boolean;
  updateCancelReservationFailure: boolean;

  cancelReservationAdminLoading: boolean;
  cancelReservationAdminSuccess: boolean;
  cancelReservationAdminFailure: boolean;
}
