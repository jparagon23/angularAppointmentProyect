import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ReservationService } from 'src/app/services/reservation.service';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { Observable } from 'rxjs';
import { selectReservationSelected } from 'src/app/state/selectors/reservetions.selectors';
import { ReservationDetail } from 'src/app/models/UserReservations.model';
import { cancelReservation } from 'src/app/state/actions/reservations.actions';

@Component({
  selector: 'app-cancel-reservation-modal',
  templateUrl: './cancel-reservation-modal.component.html',
})
export class CancelReservationModalComponent implements OnInit {
  selectedReservation$: Observable<ReservationDetail> = new Observable();
  selectedReservation: ReservationDetail | null = null; // Hold the reservation data

  constructor(
    public dialogRef: MatDialogRef<CancelReservationModalComponent>,
    private store: Store<any>,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Subscribe to get the selected reservation once when the component initializes
    this.selectedReservation$ = this.store.select(selectReservationSelected);

    // Store the selected reservation for use when cancel is confirmed
    this.selectedReservation$.subscribe((reservation) => {
      this.selectedReservation = reservation;
    });
  }

  cancelReservation() {
    // Open the confirmation dialog
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      maxWidth: '50vw',
      maxHeight: '50vh',
      data: { text: '¿Estás seguro de que deseas cancelar la reserva?' },
    });

    // Wait for the dialog to close and get the confirmation result
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true && this.selectedReservation) {
        // Dispatch the cancelReservation action only after confirmation
        this.store.dispatch(
          cancelReservation({ reservation: this.selectedReservation })
        );
        this.dialogRef.close(true);
      } else {
        // Close dialog without action if not confirmed
        this.dialogRef.close(false);
      }
    });
  }
}
