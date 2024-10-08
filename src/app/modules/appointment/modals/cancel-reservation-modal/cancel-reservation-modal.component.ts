import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { Observable } from 'rxjs';
import { selectReservationSelected } from 'src/app/state/selectors/reservetions.selectors';
import { ReservationDetail } from 'src/app/models/UserReservations.model';
import { cancelReservation } from 'src/app/state/actions/reservations.actions';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-cancel-reservation-modal',
  templateUrl: './cancel-reservation-modal.component.html',
})
export class CancelReservationModalComponent implements OnInit, OnDestroy {
  selectedReservation$: Observable<ReservationDetail> = new Observable();
  selectedReservation: ReservationDetail | null = null; // Hold the reservation data

  constructor(
    public dialogRef: MatDialogRef<CancelReservationModalComponent>,
    private readonly store: Store<any>,
    private readonly dialog: MatDialog,
    private readonly modalservice: ModalService
  ) {}
  ngOnDestroy(): void {
    this.modalservice.remove(this.dialogRef);
  }

  ngOnInit(): void {
    // Subscribe to get the selected reservation once when the component initializes
    this.selectedReservation$ = this.store.select(selectReservationSelected);
    this.modalservice.add(this.dialogRef);
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
      data: { text: '¿Estás seguro que quieres cancelar la reserva?' },
    });

    // Wait for the dialog to close and get the confirmation result
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true && this.selectedReservation) {
        // Dispatch the cancelReservation action only after confirmation
        this.store.dispatch(
          cancelReservation({ reservationId: this.selectedReservation.groupId })
        );
        this.dialogRef.close(true);
      } else {
        // Close dialog without action if not confirmed
        this.dialogRef.close(false);
      }
    });
  }
}
