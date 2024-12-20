import {
  Component,
  Inject,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import { GroupReservationInfo } from 'src/app/models/GroupReservationInfo.model';
import { ModalService } from 'src/app/services/modal.service';
import {
  cancelReservationAdmin,
  getReservationsByGroupId,
  resetCancelReservationAdminState,
} from 'src/app/state/actions/reservations.actions';
import { AppState } from 'src/app/state/app.state';
import {
  selectCancelReservationAdminFailure,
  selectCancelReservationAdminLoading,
  selectCancelReservationAdminSuccess,
  selectGroupReservationInfo,
  selectMatchingReservationId,
} from 'src/app/state/selectors/reservetions.selectors';
import { CancelReservationModalComponent } from '../cancel-reservation-modal/cancel-reservation-modal.component';
import { CancellationCause } from 'src/app/models/CancellationCause.model';

@Component({
  selector: 'app-group-reservation-info-modal',
  templateUrl: './group-reservation-info-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupReservationInfoModalComponent implements OnInit {
  groupReservationInfo$: Observable<GroupReservationInfo | null>;
  selectedReservationId$: Observable<string | null>;

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
    private readonly modalService: ModalService,
    private readonly reservationInfoModal: MatDialogRef<GroupReservationInfoModalComponent>,
    private readonly store: Store<AppState>,
    public dialog: MatDialog
  ) {
    this.groupReservationInfo$ = this.store.select(selectGroupReservationInfo);
    this.selectedReservationId$ = this.store.select(
      selectMatchingReservationId(this.data.reservationInfo.hour)
    );
  }

  ngOnInit() {
    this.modalService.add(this.reservationInfoModal);
    this.loadReservationInfo();

    this.cancelReservationAdminSuccess$
      ?.pipe(takeUntil(this.destroy$))
      .subscribe((created) => {
        if (created) {
          this.closeModal();
        }
      });
  }
  closeModal() {
    this.store.dispatch(resetCancelReservationAdminState());
    this.reservationInfoModal.close();
  }

  private loadReservationInfo() {
    const reservationId = this.data.reservationInfo.id;
    if (reservationId) {
      this.store.dispatch(getReservationsByGroupId({ groupId: reservationId }));
    } else {
      this.logError('Reservation ID is null');
    }
  }

  private logError(message: string): void {
    console.error(message); // Centralized error logging
  }

  cancelGroupReservation(): void {
    const dialogRef = this.dialog.open(CancelReservationModalComponent, {
      maxWidth: '50vw',
      maxHeight: '50vh',
      data: { text: '¿Estas seguro que quieres cancelar la reserva?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.groupReservationInfo$.pipe(take(1)).subscribe((info) => {
          if (info?.groupId) {
            this.dispatchCancelAction(info.groupId, result);
          } else {
            this.logError('No group reservation info available');
          }
        });
      }
    });
  }

  cancelSelectedReservation(): void {
    const dialogRef = this.dialog.open(CancelReservationModalComponent, {
      maxWidth: '50vw',
      maxHeight: '50vh',
      data: { text: '¿Estas seguro que quieres cancelar la reserva?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.selectedReservationId$.pipe(take(1)).subscribe((selectedId) => {
          if (selectedId) {
            this.dispatchCancelAction(`I-${selectedId}`, result);
          } else {
            this.logError('No selected reservation ID found');
          }
        });
      }
    });
  }

  private dispatchCancelAction(
    reservationId: string,
    cause: CancellationCause
  ): void {
    this.store.dispatch(
      cancelReservationAdmin({ reservationId, cause: { customReason: 'hola' } })
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
