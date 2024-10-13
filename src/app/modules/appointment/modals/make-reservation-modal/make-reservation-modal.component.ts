import { ModalService } from './../../../../services/modal.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { toZonedTime, format } from 'date-fns-tz';
import { Observable, Subscription } from 'rxjs';
import {
  createReservation,
  loadAvailableSlots,
  resetCreateReservation,
} from 'src/app/state/actions/reservations.actions';
import { AppState } from 'src/app/state/app.state';
import {
  selectAvailableSlots,
  selectCreateReservationFailure,
  selectCreateReservationLoading,
  selectCreateReservationSuccess,
} from 'src/app/state/selectors/reservetions.selectors';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-make-reservation-modal',
  templateUrl: './make-reservation-modal.component.html',
})
export class MakeReservationModalComponent implements OnInit, OnDestroy {
  selectedDate: string = this.initializeSelectedDate();
  availableTimeSlots$: Observable<string[]> =
    this.store.select(selectAvailableSlots);
  selectedSlots: string[] = [];
  createReservationLoader$: Observable<boolean> = this.store.select(
    selectCreateReservationLoading
  );
  createReservationSuccess$: Observable<boolean> = this.store.select(
    selectCreateReservationSuccess
  );
  createReservationFailure$: Observable<boolean> = this.store.select(
    selectCreateReservationFailure
  );

  private readonly subscriptions = new Subscription();

  constructor(
    public dialogRef: MatDialogRef<MakeReservationModalComponent>,
    private readonly store: Store<AppState>,
    private readonly dialog: MatDialog,
    private readonly modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.modalService.add(this.dialogRef);
    this.fetchAvailableSlots(this.selectedDate);
    this.initializeSubscriptions();
  }

  ngOnDestroy(): void {
    this.modalService.remove(this.dialogRef);
    this.subscriptions.unsubscribe();
    this.store.dispatch(resetCreateReservation());
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
    if (this.selectedSlots.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No hay horas seleccionados',
        text: 'Debes seleccionar al menos un horario para la reserva.',
        confirmButtonColor: '#f39c12',
        confirmButtonText: 'OK',
      });
      return;
    }

    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      maxWidth: '50vw',
      maxHeight: '50vh',
      data: { text: '¿Estas seguro que quieres realizar esta reserva?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.store.dispatch(
          createReservation({ selectedSlots: this.selectedSlots })
        );
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

  private initializeSubscriptions(): void {
    this.subscriptions.add(
      this.createReservationSuccess$.subscribe((success) => {
        if (success) {
          this.handleReservationSuccess();
        }
      })
    );

    this.subscriptions.add(
      this.createReservationFailure$.subscribe((failure) => {
        if (failure) {
          this.handleReservationFailure();
        }
      })
    );
  }

  private handleReservationSuccess(): void {
    this.dialogRef.close();
    Swal.fire({
      icon: 'success',
      title: 'Reserva creada',
      text: 'Tu reserva ha sido creada exitosamente.',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
    });
  }

  private handleReservationFailure(): void {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo crear la reserva. Inténtalo de nuevo.',
      confirmButtonColor: '#d33',
      confirmButtonText: 'OK',
    });
  }
}
