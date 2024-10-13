import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { Observable, Subscription } from 'rxjs';
import {
  selectCancelReservationFailure,
  selectCancelReservationLoading,
  selectCancelReservationSuccess,
  selectReservationSelected,
} from 'src/app/state/selectors/reservetions.selectors';
import { ReservationDetail } from 'src/app/models/UserReservations.model';
import {
  cancelReservation,
  resetCancelReservationState,
} from 'src/app/state/actions/reservations.actions';
import { ModalService } from 'src/app/services/modal.service';
import Swal from 'sweetalert2'; // Import Swal for alerts

@Component({
  selector: 'app-cancel-reservation-modal',
  templateUrl: './cancel-reservation-modal.component.html',
})
export class CancelReservationModalComponent implements OnInit, OnDestroy {
  selectedReservation$: Observable<ReservationDetail> = new Observable();
  selectedReservation: ReservationDetail | null = null; // Hold the reservation data

  cancelReservationLoader$: Observable<boolean> = this.store.select(
    selectCancelReservationLoading
  );
  cancelReservationSuccess$: Observable<boolean> = this.store.select(
    selectCancelReservationSuccess
  );
  cancelReservationFailure$: Observable<boolean> = this.store.select(
    selectCancelReservationFailure
  );

  private readonly subscriptions = new Subscription();

  constructor(
    public dialogRef: MatDialogRef<CancelReservationModalComponent>,
    private readonly store: Store<any>,
    private readonly dialog: MatDialog,
    private readonly modalservice: ModalService
  ) {}

  ngOnDestroy(): void {
    this.modalservice.remove(this.dialogRef);
    this.subscriptions.unsubscribe();

    // Reset cancellation state on modal destruction
    this.store.dispatch(resetCancelReservationState());
  }

  ngOnInit(): void {
    // Subscribe to get the selected reservation once when the component initializes
    this.selectedReservation$ = this.store.select(selectReservationSelected);
    this.modalservice.add(this.dialogRef);

    // Store the selected reservation for use when cancel is confirmed
    this.subscriptions.add(
      this.selectedReservation$.subscribe((reservation) => {
        this.selectedReservation = reservation;
      })
    );

    // Handle cancellation success
    this.subscriptions.add(
      this.cancelReservationSuccess$.subscribe((success) => {
        if (success) {
          Swal.fire({
            icon: 'success',
            title: 'Reserva cancelada',
            text: 'Tu reserva ha sido cancelada exitosamente.',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK',
          });
          this.dialogRef.close(true); // Close dialog with success status
        }
      })
    );

    // Handle cancellation failure
    this.subscriptions.add(
      this.cancelReservationFailure$.subscribe((failure) => {
        if (failure) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo cancelar la reserva. Inténtalo de nuevo.',
            confirmButtonColor: '#d33',
            confirmButtonText: 'OK',
          });
          this.dialogRef.close(false); // Close dialog with failure status
        }
      })
    );
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
      } else {
        // Close dialog without action if not confirmed
        this.dialogRef.close(false);
      }
    });
  }
}
