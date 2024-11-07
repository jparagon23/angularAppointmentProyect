import { LightUser } from 'src/app/models/LightUser.model';
// import { ClubUser } from './../../../../models/clubUsers.model';
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
  resetClubUsers,
  resetReservationCreated,
} from 'src/app/state/actions/club.actions';
import { AppState } from 'src/app/state/app.state';
import { isModalOpen } from 'src/app/state/selectors/modals.selectors';
import { openModal } from 'src/app/state/actions/modals.actions';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { CreateLightUserModalComponent } from '../create-light-user-modal/create-light-user-modal.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-reservation-from-table-modal',
  templateUrl: './create-reservation-from-table-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateReservationFromTableModalComponent
  implements OnInit, OnDestroy
{
  isnewUser = false;
  lightUser: LightUser | null = null;
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
    this.clearSelectors();
    this.openModal();
    this.initializeSelectors();
    this.setupUserControl();
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
    this.filteredUsers$ = this.store
      .select(selectClubUsers)
      .pipe(tap((users) => console.log('Filtered Users:', users)));
    this.loadingUsers$ = this.store
      .select(selectLoadingClubUsers)
      .pipe(tap((loading) => console.log('Loading Users:', loading)));
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
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error,
      confirmButtonColor: '#d33',
      confirmButtonText: 'OK',
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
        lightUser: this.selectedUser?.userId ? null : this.lightUser,
      })
    );
  }

  closeModal() {
    this.store.dispatch(resetReservationCreated());
    this.dialogRef.close();
  }
  trackByUserId(index: number, user: ClubUser): number {
    return user.userId ?? 0;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openCreateUserModal() {
    const dialogRef = this.dialog.open(CreateLightUserModalComponent, {
      width: '400px',
      data: {},
    });

    dialogRef.afterClosed().subscribe((result: LightUser) => {
      if (result) {
        const lightUser: ClubUser = {
          userId: null,
          userIdentification: result.email,
          completeName: `${result.name} ${result.lastName}`,
        };

        // Actualizar selectedUser y el valor de userControl
        this.selectedUser = lightUser;
        this.userControl.setValue(lightUser);
        this.isnewUser = true;
        this.lightUser = result;
      }
    });
  }
}
