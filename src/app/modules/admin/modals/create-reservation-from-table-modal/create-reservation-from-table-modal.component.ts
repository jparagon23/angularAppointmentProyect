import { LightUser } from 'src/app/models/LightUser.model';
import {
  Component,
  Inject,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ClubUser } from 'src/app/models/clubUsers.model';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogState,
} from '@angular/material/dialog';
import {
  loadingCreateReservation,
  reservationCreatedFailure,
  selectReservationCreated,
} from 'src/app/state/club/club.selectors';
import {
  createReservationAdmin,
  resetClubUsers,
  resetReservationCreated,
} from 'src/app/state/club/club.actions';
import { AppState } from 'src/app/state/app.state';
import { isModalOpen } from 'src/app/state/selectors/modals.selectors';
import { openModal } from 'src/app/state/actions/modals.actions';
import Swal from 'sweetalert2';
import { UserListReturn } from 'src/app/models/UserListReturn.model';
import { CreateReservationAdmin } from 'src/app/models/createReservationAdmin.model';

@Component({
  selector: 'app-create-reservation-from-table-modal',
  templateUrl: './create-reservation-from-table-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateReservationFromTableModalComponent
  implements OnInit, OnDestroy
{
  userReturn!: UserListReturn | null;
  isnewUser = false;
  lightUser: LightUser | null = null;
  reservationCreated$?: Observable<boolean>;
  reservationCreatedLoader$?: Observable<boolean>;
  reservationCreatedFailure$?: Observable<boolean>;
  selectedUser?: ClubUser;
  private readonly destroy$ = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      reservationInfo: {
        date: string;
        id: string | null;
        user: string;
        hour: string[];
        courtId: number | null;
      };
    },
    private readonly store: Store<AppState>,
    private readonly dialogRef: MatDialogRef<CreateReservationFromTableModalComponent>
  ) {}

  ngOnInit() {
    this.clearSelectors();
    this.openModal();
    this.initializeSelectors();
    this.subscribeToModalState();
    this.subscribeToErrorState();
  }

  clearSelectors() {
    this.store.dispatch(resetReservationCreated());
    this.store.dispatch(resetClubUsers());
  }

  private openModal() {
    this.store.dispatch(
      openModal({ modalId: 'createReservationFromTableModal' })
    );
  }

  private initializeSelectors() {
    this.reservationCreated$ = this.store.select(selectReservationCreated);
    this.reservationCreatedLoader$ = this.store.select(
      loadingCreateReservation
    );
    this.reservationCreatedFailure$ = this.store.select(
      reservationCreatedFailure
    );
  }

  private subscribeToModalState() {
    this.store
      .pipe(
        select(isModalOpen('createReservationFromTableModal')),
        takeUntil(this.destroy$)
      )
      .subscribe((isOpen) => {
        if (!isOpen && this.dialogRef.getState() !== MatDialogState.CLOSED) {
          this.dialogRef.close();
        }
      });

    this.reservationCreated$
      ?.pipe(takeUntil(this.destroy$))
      .subscribe((created) => {
        if (created) {
          this.closeModal();
        }
      });
  }

  private subscribeToErrorState() {
    this.reservationCreatedFailure$
      ?.pipe(takeUntil(this.destroy$))
      .subscribe((error) => {
        if (error) {
          this.openErrorDialog(
            'Por el momento no se puede realizar la reserva'
          );
        }
      });
  }

  private openErrorDialog(error: string) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error,
      confirmButtonColor: '#d33',
      confirmButtonText: 'OK',
    });
  }

  onUserSelected(user: UserListReturn | null) {
    this.userReturn = user;
  }

  createReservation() {
    const { hour } = this.data.reservationInfo;

    const courtsId = this.data.reservationInfo.courtId;

    const createReservationAdminDto: CreateReservationAdmin = {
      selectedSlots: hour,
      userId: this.userReturn?.userId ?? '',
      lightUser: this.userReturn?.lightUser ?? null,
      courts: courtsId ? [courtsId.toString()] : null,
    };

    this.store.dispatch(createReservationAdmin({ createReservationAdminDto }));
  }

  closeModal() {
    this.dialogRef.close();
    this.dialogRef.afterClosed().subscribe(() => {
      this.store.dispatch(resetReservationCreated());
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
