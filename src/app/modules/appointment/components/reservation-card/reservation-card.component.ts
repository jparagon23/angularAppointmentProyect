import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ReservationDetail } from 'src/app/models/UserReservations.model';
import { cancelReservation } from 'src/app/state/actions/reservations.actions';
import { ConfirmationModalComponent } from '../../modals/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-reservation-card',
  templateUrl: './reservation-card.component.html',
})
export class ReservationCardComponent {
  @Input() reservation!: ReservationDetail;

  constructor(public dialog: MatDialog, private readonly store: Store<any>) {}

  cancelReservation(): void {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      data: { text: '¿Estás seguro de que deseas cancelar esta reserva?' },
      maxWidth: '100vw',
      maxHeight: '100vh',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.store.dispatch(
          cancelReservation({ reservationId: this.reservation.groupId })
        );
      }
    });
  }
}
