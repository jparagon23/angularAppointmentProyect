import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ReservationService } from 'src/app/services/reservation.service';
import { ConfirmationCancelReservationComponent } from '../confirmation-cancel-reservation/confirmation-cancel-reservation.component';

@Component({
  selector: 'app-cancel-reservation-modal',
  templateUrl: './cancel-reservation-modal.component.html',
})
export class CancelReservationModalComponent {
  constructor(
    public dialogRef: MatDialogRef<CancelReservationModalComponent>,
    private reservationService: ReservationService,
    private store: Store<any>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  cancelReservation() {
    const dialogRef = this.dialog.open(ConfirmationCancelReservationComponent, {
      maxWidth: '50vw',
      maxHeight: '50vh',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.dialogRef.close(true);
      }
    });
  }
}
