import { Component, EventEmitter, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { toZonedTime, format } from 'date-fns-tz';
import { AvailableSlotsResponse } from 'src/app/models/reservation.model';
import { ReservationService } from 'src/app/services/reservation.service';

@Component({
  selector: 'app-make-reservation-modal',
  templateUrl: './make-reservation-modal.component.html',
})
export class MakeReservationModalComponent {
  selectedDate: string = '';

  selectedSlots: string[] = [];

  availableTimeSlots: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<MakeReservationModalComponent>,
    private reservationService: ReservationService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    const today = new Date();
    const bogotaTimeZone = 'America/Bogota';
    const zonedDate = toZonedTime(today, bogotaTimeZone);

    this.selectedDate = format(zonedDate, 'yyyy-MM-dd', {
      timeZone: bogotaTimeZone,
    });
  }

  onClickContinue(): void {
    console.log('Selected slots:', this.selectedSlots);
  }

  onDateChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.selectedDate = inputElement.value;
    console.log('Selected date:', this.selectedDate);
    // Aquí puedes manejar la lógica cuando se seleccione la fecha

    this.reservationService
      .getAvailableSlotsPerDay(this.selectedDate)
      .subscribe({
        next: (response: AvailableSlotsResponse) => {
          this.availableTimeSlots = response.availableSlots.map((slot) => {
            const dateTime = new Date(slot.date.dateTime);
            return dateTime.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });
          });
          console.log('Available hours:', this.availableTimeSlots);
        },
        error: (err) => {
          console.error('Error fetching available slots:', err);
        },
        complete: () => {
          console.log('Fetching available slots completed');
        },
      });
  }

  onSlotSelect(slot: string): void {
    console.log('Selected slot:', slot);
    this.selectedSlots.push(slot);
  }
}
