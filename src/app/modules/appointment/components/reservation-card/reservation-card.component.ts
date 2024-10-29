import { resertUpdateUserStatus } from './../../../../state/actions/users.actions';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ReservationDetail } from 'src/app/models/UserReservations.model';
import { CancelReservationModalComponent } from '../../modals/cancel-reservation-modal/cancel-reservation-modal.component';
import {
  cancelReservation,
  selectReservation,
} from 'src/app/state/actions/reservations.actions';
import { ConfirmationModalComponent } from '../../modals/confirmation-modal/confirmation-modal.component';
import { text } from '@fortawesome/fontawesome-svg-core';
import { Observable, Subscription } from 'rxjs';
import {
  selectCancelReservationFailure,
  selectCancelReservationSuccess,
} from 'src/app/state/selectors/reservetions.selectors';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reservation-card',
  templateUrl: './reservation-card.component.html',
})
export class ReservationCardComponent implements OnInit {
  constructor(public dialog: MatDialog, private readonly store: Store<any>) {}

  @Input() reservation!: ReservationDetail;
  private readonly subscriptions = new Subscription();
  cancelReservationSuccess$: Observable<boolean> = this.store.select(
    selectCancelReservationSuccess
  );
  cancelReservationFailure$: Observable<boolean> = this.store.select(
    selectCancelReservationFailure
  );

  ngOnInit(): void {
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
        }
      })
    );
  }

  openCancelReservationModal() {
    // Primero abre el modal
    this.dialog.open(CancelReservationModalComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
    });

    // Finalmente, despacha la selección de la reserva
    this.store.dispatch(selectReservation({ reservation: this.reservation }));
  }

  cancelReservation() {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      data: {
        text: '¿Estás seguro de que deseas cancelar esta reserva?',
      },
      maxWidth: '100vw',
      maxHeight: '100vh',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        // Dispatch the cancelReservation action only after confirmation
        this.store.dispatch(
          cancelReservation({ reservationId: this.reservation.groupId })
        );
      }
    });
  }
}
