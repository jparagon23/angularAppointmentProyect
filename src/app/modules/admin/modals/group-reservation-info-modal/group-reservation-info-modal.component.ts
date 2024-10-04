import {
  Component,
  Inject,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import { GroupReservationInfo } from 'src/app/models/GroupReservationInfo.model';
import { ModalService } from 'src/app/services/modal.service';
import {
  cancelReservationAdmin,
  getReservationsByGroupId,
} from 'src/app/state/actions/reservations.actions';
import { AppState } from 'src/app/state/app.state';
import {
  selectGroupReservationInfo,
  selectMatchingReservationId,
} from 'src/app/state/selectors/reservetions.selectors';

@Component({
  selector: 'app-group-reservation-info-modal',
  templateUrl: './group-reservation-info-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupReservationInfoModalComponent implements OnInit {
  groupReservationInfo$: Observable<GroupReservationInfo | null>;
  selectedReservationId$: Observable<string | null>;

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
    private modalService: ModalService,
    private reservationInfoModal: MatDialogRef<GroupReservationInfoModalComponent>,
    private store: Store<AppState>
  ) {
    this.groupReservationInfo$ = this.store.select(selectGroupReservationInfo);
    this.selectedReservationId$ = this.store.select(
      selectMatchingReservationId(this.data.reservationInfo.hour)
    );
  }

  ngOnInit() {
    this.modalService.add(this.reservationInfoModal);
    this.loadReservationInfo();
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
    this.groupReservationInfo$.pipe(take(1)).subscribe((info) => {
      if (info?.groupId) {
        this.dispatchCancelAction(info.groupId);
      } else {
        this.logError('No group reservation info available');
      }
    });
  }

  cancelSelectedReservation(): void {
    this.selectedReservationId$.pipe(take(1)).subscribe((selectedId) => {
      if (selectedId) {
        this.dispatchCancelAction(`I-${selectedId}`);
      } else {
        this.logError('No selected reservation ID found');
      }
    });
  }

  private dispatchCancelAction(reservationId: string): void {
    this.store.dispatch(cancelReservationAdmin({ reservationId }));
    this.reservationInfoModal.close(); // Close modal after successful cancellation
  }
}
