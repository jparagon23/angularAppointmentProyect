export interface Reservation {
  id: string | null;
  description: string;
}

export interface ReservationData {
  reservations: Reservation[];
}

export interface ClubReservations {
  reservationsData: ReservationData[];
  reservationHeaders: string[];
}
