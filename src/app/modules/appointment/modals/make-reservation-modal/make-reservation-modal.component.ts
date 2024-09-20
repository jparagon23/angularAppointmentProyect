import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { toZonedTime, format } from 'date-fns-tz';
import { Observable } from 'rxjs';
import { AvailableSlotsResponse } from 'src/app/models/reservation.model';
import { ReservationService } from 'src/app/services/reservation.service';
import { createReservation, loadAvailableSlots, loadReservations } from 'src/app/state/actions/reservations.actions';
import { selectAvailableSlots } from 'src/app/state/selectors/reservetions.selectors';

@Component({
  selector: 'app-make-reservation-modal',
  templateUrl: './make-reservation-modal.component.html',
})
export class MakeReservationModalComponent implements OnInit {


  selectedDate: string = '';
  availableTimeSlots$: Observable<string[]> = new Observable();
  selectedSlots: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<MakeReservationModalComponent>,
    private store: Store<any>,
  ) {
    this.initializeSelectedDate();
  }

  ngOnInit(): void {
    this.availableTimeSlots$ = this.store.select(selectAvailableSlots);
    this.fetchAvailableSlots(this.selectedDate);
  }

  initializeSelectedDate(): void {
    const today = new Date();
    const bogotaTimeZone = 'America/Bogota';
    const zonedDate = toZonedTime(today, bogotaTimeZone);
    this.selectedDate = format(zonedDate, 'yyyy-MM-dd', {
      timeZone: bogotaTimeZone,
    });
  }

  fetchAvailableSlots(date: string): void {
    this.store.dispatch(loadAvailableSlots({ date }));
  }

  onClickContinue(): void {
      this.store.dispatch(createReservation({ selectedSlots:this.selectedSlots }));
      this.dialogRef.close();
  }

  onDateChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.selectedDate = inputElement.value;
    console.log('Selected date:', this.selectedDate);

    // Clear selectedSlots
    this.selectedSlots = [];

    this.fetchAvailableSlots(this.selectedDate);
  }

  onSlotSelect(slot: string): void {
    console.log('Selected slot:', slot);
    this.selectedSlots.push(slot);
  }

  deleteSelectedHour(slot: string): void {
    const index = this.selectedSlots.indexOf(slot);
    if (index !== -1) {
      this.selectedSlots.splice(index, 1);
    }
  }


}
