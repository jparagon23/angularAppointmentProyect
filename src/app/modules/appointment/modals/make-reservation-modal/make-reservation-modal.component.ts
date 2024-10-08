import { ModalService } from './../../../../services/modal.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { toZonedTime, format } from 'date-fns-tz';
import { first, Observable, Subscription } from 'rxjs';
import {
  createReservation,
  loadAvailableSlots,
} from 'src/app/state/actions/reservations.actions';
import { AppState } from 'src/app/state/app.state';
import {
  selectAvailableSlots,
  selectCreateReservationSuccess,
} from 'src/app/state/selectors/reservetions.selectors';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-make-reservation-modal',
  templateUrl: './make-reservation-modal.component.html',
})
export class MakeReservationModalComponent implements OnInit, OnDestroy {
  selectedDate: string = this.initializeSelectedDate();
  availableTimeSlots$: Observable<string[]> =
    this.store.select(selectAvailableSlots);
  selectedSlots: string[] = [];
  private readonly subscriptions: Subscription = new Subscription();

  constructor(
    public dialogRef: MatDialogRef<MakeReservationModalComponent>,
    private readonly store: Store<AppState>,
    private readonly dialog: MatDialog,
    private readonly modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.modalService.add(this.dialogRef);
    this.fetchAvailableSlots(this.selectedDate);
  }

  ngOnDestroy(): void {
    this.modalService.remove(this.dialogRef);

    this.subscriptions.unsubscribe();
  }

  initializeSelectedDate(): string {
    const today = new Date();
    const bogotaTimeZone = 'America/Bogota';
    const zonedDate = toZonedTime(today, bogotaTimeZone);
    return format(zonedDate, 'yyyy-MM-dd', { timeZone: bogotaTimeZone });
  }

  fetchAvailableSlots(date: string): void {
    this.store.dispatch(loadAvailableSlots({ date }));
  }

  onClickContinue(): void {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      maxWidth: '50vw',
      maxHeight: '50vh',
      data: { text: '¿Estas seguro que quieres realizar esta reserva?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        if (this.selectedSlots.length > 0) {
          this.store.dispatch(
            createReservation({ selectedSlots: this.selectedSlots })
          );

          if (this.store.select(selectCreateReservationSuccess).pipe(first())) {
            this.dialogRef.close();
          }
        } else {
          console.warn('No hay slots seleccionados');
        }
      }
      if (result === false) {
        /* empty */
      }
    });
  }

  onDateChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.selectedDate = inputElement.value;
    this.selectedSlots = [];
    this.fetchAvailableSlots(this.selectedDate);
  }

  onSlotSelect(slot: string): void {
    if (!this.selectedSlots.includes(slot)) {
      this.selectedSlots = [...this.selectedSlots, slot];
    }
  }

  deleteSelectedSlot(slot: string): void {
    this.selectedSlots = this.selectedSlots.filter((s) => s !== slot);
  }

  showErrorMessage(message: string): void {
    console.error(message);
  }
}
