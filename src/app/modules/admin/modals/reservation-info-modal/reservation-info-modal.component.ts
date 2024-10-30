import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ConfirmationModalComponent } from 'src/app/modules/appointment/modals/confirmation-modal/confirmation-modal.component';
import { ModalService } from 'src/app/services/modal.service';
import { cancelReservationAdmin } from 'src/app/state/actions/reservations.actions';
import { CancelReservationModalComponent } from '../cancel-reservation-modal/cancel-reservation-modal.component';

@Component({
  selector: 'app-reservation-info-modal',
  templateUrl: './reservation-info-modal.component.html',
})
export class ReservationInfoModalComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      reservationInfo: {
        date: string;
        id: string | null;
        user: string;
        hour: string;
      };
    },
    public dialog: MatDialog,
    private readonly modalService: ModalService,
    private readonly reservationInfoModal: MatDialogRef<ReservationInfoModalComponent>,
    private readonly store: Store<any>
  ) {}

  ngOnInit() {
    this.modalService.add(this.reservationInfoModal);
  }

  cancelReservation() {
    const dialogRef = this.dialog.open(CancelReservationModalComponent, {
      maxWidth: '50vw',
      maxHeight: '50vh',
      data: { text: '¿Estas seguro que quieres cancelar la reserva?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (this.data.reservationInfo.id) {
          this.store.dispatch(
            cancelReservationAdmin({
              reservationId: this.data.reservationInfo.id,
              cause: result,
            })
          );
        }

        this.reservationInfoModal.close(true);
      }
      if (result === false) {
        /* empty */
      }
    });
  }
}
