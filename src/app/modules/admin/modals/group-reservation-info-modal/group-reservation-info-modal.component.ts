import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { GroupReservationInfo } from 'src/app/models/GroupReservationInfo.model';
import { ModalService } from 'src/app/services/modal.service';
import { getReservationsByGroupId } from 'src/app/state/actions/reservations.actions';
import { selectGroupReservationInfo } from 'src/app/state/selectors/reservetions.selectors';

@Component({
  selector: 'app-group-reservation-info-modal',
  templateUrl: './group-reservation-info-modal.component.html',
})
export class GroupReservationInfoModalComponent {
  groupReservationInfo$: Observable<GroupReservationInfo | null> =
    new Observable();

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
    private reservationInfoModal: MatDialogRef<GroupReservationInfoModalComponent>,
    private store: Store<any>
  ) {}

  ngOnInit() {
    console.log(this.data);

    this.modalService.add(this.reservationInfoModal);

    if (this.data.reservationInfo.id) {
      this.store.dispatch(
        getReservationsByGroupId({ groupId: this.data.reservationInfo.id })
      );
    } else {
      console.error('Reservation ID is null');
    }

    this.groupReservationInfo$ = this.store.select(selectGroupReservationInfo);
  }

  cancelGroup() {
    // Lógica para cancelar el grupo de reserva
  }

  cancelSelectedReservations() {
    // Lógica para cancelar las reservas seleccionadas
  }
}
