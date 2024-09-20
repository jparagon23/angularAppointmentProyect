import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ReservationService } from 'src/app/services/reservation.service';
import { ConfirmationCancelReservationComponent } from '../confirmation-cancel-reservation/confirmation-cancel-reservation.component';
import { Observable } from 'rxjs';
import { selectReservationSelected } from 'src/app/state/selectors/reservetions.selectors';
import { ReservationDetail } from 'src/app/models/UserReservations.model';

@Component({
  selector: 'app-cancel-reservation-modal',
  templateUrl: './cancel-reservation-modal.component.html',
})
export class CancelReservationModalComponent implements OnInit {

  selectedReservation$: Observable<ReservationDetail> = new Observable();

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

  ngOnInit(): void {
    this.selectedReservation$ = this.store.select(selectReservationSelected);
  }
}
