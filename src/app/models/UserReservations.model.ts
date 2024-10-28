export interface IndividualReservation {
  reservationId: number;
  clubName: string;
  userName: string;
  court: string;
  dateTime: string;
}

export interface ReservationDetail {
  groupId: string;
  date: string;
  initialHour: string;
  endHour: string;
  groupCourtId: number[];
  groupCourtName: string[];
  individualReservationsId: IndividualReservation[];
  club: string;
}

export interface UserReservationResponse {
  status: string;
  message: string;
  reservationsDetails: ReservationDetail[];
}
