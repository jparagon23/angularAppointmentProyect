import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import { GroupReservationInfo } from 'src/app/models/GroupReservationInfo.model';
import { ModalService } from 'src/app/services/modal.service';
import {
  cancelReservationAdmin,
  getReservationsByGroupId,
} from 'src/app/state/actions/reservations.actions';
import { selectGroupReservationInfo } from 'src/app/state/selectors/reservetions.selectors';

@Component({
  selector: 'app-group-reservation-info-modal',
  templateUrl: './group-reservation-info-modal.component.html',
})
export class GroupReservationInfoModalComponent implements OnInit {
  groupReservationInfo$: Observable<GroupReservationInfo | null>;
  selectedReservationId: string | null = null;

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
  ) {
    this.groupReservationInfo$ = this.store.select(selectGroupReservationInfo);
  }

  ngOnInit() {
    console.log(this.data);
    this.modalService.add(this.reservationInfoModal);
    this.loadReservationInfo();
    this.checkMatchingReservation();
  }

  private loadReservationInfo() {
    const reservationId = this.data.reservationInfo.id;
    if (reservationId) {
      this.store.dispatch(getReservationsByGroupId({ groupId: reservationId }));
    } else {
      console.error('Reservation ID is null');
    }
  }

  cancelGroupReservation() {
    console.log('Cancel group reservation');
    // Tomamos la información de la reserva una sola vez
    this.groupReservationInfo$.pipe(take(1)).subscribe((info) => {
      if (info && info.groupId) {
        this.store.dispatch(
          cancelReservationAdmin({ reservationId: info.groupId })
        );
        console.log(`Reservation with groupId ${info.groupId} canceled.`);
        this.reservationInfoModal.close(); // Cerrar el modal tras cancelar
      } else {
        console.log('No group reservation info available');
      }
    });
  }

  private checkMatchingReservation() {
    // Subscribe to the groupReservationInfo$ to check if any reservation matches the condition
    this.groupReservationInfo$.subscribe((groupReservationInfo) => {
      if (groupReservationInfo) {
        groupReservationInfo.individualReservationsId.forEach(
          (individualReservation) => {
            // Compare the hour with the formatted dateTime
            if (
              this.data.reservationInfo.hour ===
              this.formatTime(individualReservation.dateTime)
            ) {
              // Save the reservationId if the condition is met
              this.selectedReservationId =
                individualReservation.reservationId.toString();
            }
          }
        );
      }
    });
  }

  private formatTime(value: string | Date): string {
    const date = new Date(value);
    const hours = date.getHours().toString();
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`;
  }

  cancelSelectedReservations() {
    console.log('Cancel selected reservations');
    console.log(this.selectedReservationId);
    // Lógica para cancelar las reservas seleccionadas

    if (this.selectedReservationId) {
      this.store.dispatch(
        cancelReservationAdmin({
          reservationId: `I-${this.selectedReservationId}`,
        })
      );
      console.log(
        `Reservation with ID I-${this.selectedReservationId} canceled.`
      );
      this.reservationInfoModal.close(); // Cerrar el modal tras cancelar
    } else {
      console.error('Selected reservation ID is null');
    }
  }
}
