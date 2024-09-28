import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ConfirmationModalComponent } from 'src/app/modules/appointment/modals/confirmation-modal/confirmation-modal.component';
import { ModalService } from 'src/app/services/modal.service';

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
    private reservationInfoModal: MatDialogRef<ReservationInfoModalComponent>
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
        console.log('eliminandola por confirmada');
        this.reservationInfoModal.close(true);
      }
      if (result === false) {
      }
    });
  }
}
