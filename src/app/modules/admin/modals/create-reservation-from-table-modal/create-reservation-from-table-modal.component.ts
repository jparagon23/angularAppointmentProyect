import {
  Component,
  Inject,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, takeUntil, tap } from 'rxjs/operators';
import { ClubUser } from 'src/app/models/clubUsers.model';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
  MatDialogState,
} from '@angular/material/dialog';
import {
  loadingCreateReservation,
  reservationCreatedFailure,
  selectClubUsers,
  selectLoadingClubUsers,
  selectReservationCreated,
} from 'src/app/state/selectors/club.selectors';
import {
  createReservationAdmin,
  getClubUserByNameOrId,
  resetReservationCreated,
} from 'src/app/state/actions/club.actions';
import { AppState } from 'src/app/state/app.state';
import { isModalOpen } from 'src/app/state/selectors/modals.selectors';
import { openModal } from 'src/app/state/actions/modals.actions';
import { ErrorModalComponent } from '../error-modal/error-modal.component';

@Component({
  selector: 'app-create-reservation-from-table-modal',
  templateUrl: './create-reservation-from-table-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateReservationFromTableModalComponent
  implements OnInit, OnDestroy
{
  userControl = new FormControl();
  filteredUsers$?: Observable<ClubUser[]>;
  loadingUsers$?: Observable<boolean>;
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
        hour: string;
      };
    },
    private readonly store: Store<AppState>,
    private readonly dialogRef: MatDialogRef<CreateReservationFromTableModalComponent>,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit() {
    this.openModal();
    this.initializeSelectors();
    this.setupUserControl();
    this.subscribeToModalState();
    this.subscribeToErrorState();
  }

  private openModal() {
    this.store.dispatch(
      openModal({ modalId: 'createReservationFromTableModal' })
    );
  }

  private initializeSelectors() {
    this.filteredUsers$ = this.store.select(selectClubUsers);
    this.loadingUsers$ = this.store.select(selectLoadingClubUsers);
    this.reservationCreated$ = this.store.select(selectReservationCreated);
    this.reservationCreatedLoader$ = this.store.select(
      loadingCreateReservation
    );
    this.reservationCreatedFailure$ = this.store.select(
      reservationCreatedFailure
    );
  }

  private setupUserControl() {
    this.userControl.valueChanges
      .pipe(
        debounceTime(500), // Increased debounce time for better performance
        tap((searchTerm) => {
          if (!this.selectedUser && searchTerm) {
            this.store.dispatch(
              getClubUserByNameOrId({ nameOrId: searchTerm })
            );
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
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
    this.dialog.open(ErrorModalComponent, {
      data: { message: error },
    });
  }

  onUserSelected(user: ClubUser) {
    this.selectedUser = user;
  }

  displayUserName(user?: ClubUser): string {
    return user?.completeName ?? '';
  }

  createReservation() {
    const { hour } = this.data.reservationInfo;

    this.store.dispatch(
      createReservationAdmin({
        selecteDates: [hour],
        userId: this.selectedUser?.userId?.toString() ?? '',
      })
    );
  }

  closeModal() {
    this.store.dispatch(resetReservationCreated());
    this.dialogRef.close();
  }
  trackByUserId(index: number, user: ClubUser): number {
    return user.userId;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
