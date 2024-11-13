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
  cancelReservationAdmin,
  resetCancelReservationAdminState,
} from 'src/app/state/actions/reservations.actions';
import { CancelReservationModalComponent } from '../cancel-reservation-modal/cancel-reservation-modal.component';
import { Observable, Subject, takeUntil } from 'rxjs';
import {
  selectCancelReservationAdminFailure,
  selectCancelReservationAdminLoading,
  selectCancelReservationAdminSuccess,
} from 'src/app/state/selectors/reservetions.selectors';

@Component({
  selector: 'app-reservation-info-modal',
  templateUrl: './reservation-info-modal.component.html',
})
export class ReservationInfoModalComponent {
  cancelReservationAdminLoading$?: Observable<boolean> = this.store.select(
    selectCancelReservationAdminLoading
  );
  cancelReservationAdminSuccess$: Observable<boolean> = this.store.select(
    selectCancelReservationAdminSuccess
  );

  cancelResevationAdminFailure$: Observable<boolean> = this.store.select(
    selectCancelReservationAdminFailure
  );

  private readonly destroy$ = new Subject<void>();

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

    this.cancelReservationAdminSuccess$
      ?.pipe(takeUntil(this.destroy$))
      .subscribe((created) => {
        if (created) {
          this.closeModal();
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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
      }
      if (result === false) {
        /* empty */
      }
    });
  }

  closeModal() {
    this.store.dispatch(resetCancelReservationAdminState());
    this.reservationInfoModal.close(true);
  }
}
