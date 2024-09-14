export interface ReservationConfirmation {
  status: string;
  message: string;
  reservationDetails: ReservationDetail[];
}

interface ReservationDetail {
  reservationId: number;
  clubName: string;
  userName: string;
  court: string;
  dateTime: string;
}
