import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ReservationDetail } from 'src/app/models/UserReservations.model';
import { CancelReservationModalComponent } from '../../modals/cancel-reservation-modal/cancel-reservation-modal.component';
import { selectReservation } from 'src/app/state/actions/reservations.actions';

@Component({
  selector: 'app-reservation-card',
  templateUrl: './reservation-card.component.html',
})
export class ReservationCardComponent {
  constructor(public dialog: MatDialog, private readonly store: Store<any>) {}
  @Input() reservation!: ReservationDetail;

  openCancelReservationModal() {
    // Primero abre el modal
    this.dialog.open(CancelReservationModalComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
    });

    // Finalmente, despacha la selección de la reserva
    this.store.dispatch(selectReservation({ reservation: this.reservation }));
  }
}
