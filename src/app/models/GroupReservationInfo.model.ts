export interface IndividualReservation {
  reservationId: number;
  clubName: string;
  userName: string;
  court: string;
  dateTime: string;
}

export interface GroupReservationInfo {
  groupId: string;
  date: string;
  initialHour: string;
  endHour: string;
  groupCourtIds: number[];
  groupCourtNames: string[];
  individualReservations: IndividualReservation[];
  clubName: string;
}
