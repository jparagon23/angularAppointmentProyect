import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ConfirmationModalComponent } from 'src/app/modules/appointment/modals/confirmation-modal/confirmation-modal.component';
import { ModalService } from 'src/app/services/modal.service';
import {
  cancelReservation,
  cancelReservationAdmin,
} from 'src/app/state/actions/reservations.actions';

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
    private modalService: ModalService,
    private reservationInfoModal: MatDialogRef<ReservationInfoModalComponent>,
    private store: Store<any>
  ) {}

  ngOnInit() {
    this.modalService.add(this.reservationInfoModal);
  }

  cancelReservation() {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      maxWidth: '50vw',
      maxHeight: '50vh',
      data: { text: '¿Estas seguro que quieres cancelar la reserva?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        if (this.data.reservationInfo.id) {
          this.store.dispatch(
            cancelReservationAdmin({
              reservationId: this.data.reservationInfo.id,
            })
          );
        }

        this.reservationInfoModal.close(true);
      }
      if (result === false) {
      }
    });
  }
}
