import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { format, toZonedTime } from 'date-fns-tz';
import { ReservationInfoModalComponent } from '../../modals/reservation-info-modal/reservation-info-modal.component';

@Component({
  selector: 'app-admin-dashboard-page',
  templateUrl: './admin-dashboard-page.component.html',
})
export class AdminDashboardPageComponent {
  selectedDate: string = this.initializeSelectedDate();

  reservations = {
    reservationsData: [
      {
        reservations: [
          {
            id: null,
            description: '16:00',
          },
          {
            id: '43',
            description: 'usuario base',
          },
          {
            id: '-1',
            description: 'Disponible',
          },
          {
            id: '-1',
            description: 'Disponible',
          },
          {
            id: '-1',
            description: 'Disponible',
          },
        ],
      },
      {
        reservations: [
          {
            id: null,
            description: '17:00',
          },
          {
            id: '43',
            description: 'usuario base',
          },
          {
            id: '44',
            description: 'usuario base',
          },
          {
            id: '-99',
            description: 'No disponible',
          },
          {
            id: 'I-177',
            description: 'usuario base',
          },
        ],
      },
      {
        reservations: [
          {
            id: null,
            description: '18:00',
          },
          {
            id: '-99',
            description: 'No disponible',
          },
          {
            id: '44',
            description: 'usuario base',
          },
          {
            id: '-99',
            description: 'No disponible',
          },
          {
            id: '-99',
            description: 'No disponible',
          },
        ],
      },
    ],
    reservationHeaders: [
      'Hora',
      'Cancha 1',
      'Cancha 2',
      'Cancha 3',
      'Cancha 4',
    ],
  };

  constructor(public dialog: MatDialog) {}

  initializeSelectedDate(): string {
    const today = new Date();
    const bogotaTimeZone = 'America/Bogota';
    const zonedDate = toZonedTime(today, bogotaTimeZone);
    return format(zonedDate, 'yyyy-MM-dd', { timeZone: bogotaTimeZone });
  }

  onDateChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.selectedDate = inputElement.value;
    console.log(this.selectedDate);
  }

  onReservationClick(
    reservation: { id: string | null; description: string },
    hour: string
  ): void {
    const reservationInfo = {
      date: this.selectedDate,
      id: reservation.id,
      user: reservation.description,
      hour: hour,
    };

    if (reservation.id === '-1') {
      console.log('Reservar');
      return;
    }

    if (reservation.id === '-99') {
      console.log('No disponible');
      return;
    }
    if (reservation.id !== null && reservation.id.startsWith('I')) {
      console.log('Reservado');
      this.dialog.open(ReservationInfoModalComponent, {
        maxWidth: '50vw',
        maxHeight: '50vh',
        data: { reservationInfo },
      });

      return;
    } else {
      console.log('Reserva Grupal');
    }
  }
}
