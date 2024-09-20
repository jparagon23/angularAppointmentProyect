import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { toZonedTime, format } from 'date-fns-tz';
import { first, Observable } from 'rxjs';
import { AvailableSlotsResponse } from 'src/app/models/reservation.model';
import { ReservationService } from 'src/app/services/reservation.service';
import { createReservation, loadAvailableSlots, loadReservations } from 'src/app/state/actions/reservations.actions';
import { selectAvailableSlots, selectReservationsFeature, selectReservationSuccess } from 'src/app/state/selectors/reservetions.selectors';

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
    if (this.selectedSlots.length > 0) {
      // Despacha la acción para crear la reserva
      this.store.dispatch(createReservation({ selectedSlots: this.selectedSlots }));
  
      // Escucha el éxito o fallo de la creación de la reserva
      this.store.select(selectReservationsFeature).pipe(
        first()  // Solo toma la primera emisión y luego completa la suscripción
      ).subscribe((state) => {
        if (state.createReservationSuccess) {
          // Si la reserva se creó exitosamente, cierra el diálogo
          this.dialogRef.close();
        } else if (state.createReservationFailure) {
          // Maneja el error si ocurre
          console.error('Error al crear la reserva', state.error);
        }
      });
    } else {
      console.warn('No hay slots seleccionados');
    }
  }  
  

  onDateChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.selectedDate = inputElement.value;
    console.log('Selected date:', this.selectedDate);

    this.selectedSlots = [];

    this.fetchAvailableSlots(this.selectedDate);
  }

  onSlotSelect(slot: string): void {
    if (!this.selectedSlots.includes(slot)) {
      this.selectedSlots.push(slot);
    }
    console.log('Selected slot:', slot);
  }
  

  deleteSelectedHour(slot: string): void {
    const index = this.selectedSlots.indexOf(slot);
    if (index !== -1) {
      this.selectedSlots.splice(index, 1);
    }
  }


}
