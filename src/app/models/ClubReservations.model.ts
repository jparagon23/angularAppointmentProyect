export interface Reservation {
  id: string | null;
  description: string;
  courtId: number | null;
}

export interface ReservationData {
  reservations: Reservation[];
}

export interface ClubReservations {
  reservationsData: ReservationData[];
  reservationHeaders: string[];
}
