export interface ClubReportDTO {
  reservationsMadeByDay: ReportDto;
  reservationsByHours: ReportDto;
  reservationsByDay: ReportDto;
  reservationsByDayOfWeek: ReportDto;
  reservationsByUser: ReportReservationByUserDTO[];
}

export interface ReportDto {
  labels: string[];
  data: number[];
}

export interface ReportReservationByUserDTO {
  user: string;
  reservations: number;
}
