import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, startWith, tap } from 'rxjs/operators';
import { ClubUser } from 'src/app/models/clubUsers.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  loadingCreateReservation,
  selectClubUsers,
  selectLoadingClubUsers,
  selectReservationCreated,
} from 'src/app/state/selectors/club.selectors';
import {
  createReservationAdmin,
  getClubUserByNameOrId,
} from 'src/app/state/actions/club.actions';
import { AppState } from 'src/app/state/app.state';
import { isModalOpen } from 'src/app/state/selectors/modals.selectors';
import { closeModal, openModal } from 'src/app/state/actions/modals.actions';

@Component({
  selector: 'app-create-reservation-from-table-modal',
  templateUrl: './create-reservation-from-table-modal.component.html',
})
export class CreateReservationFromTableModalComponent
  implements OnInit, OnDestroy
{
  userControl = new FormControl();
  filteredUsers$?: Observable<ClubUser[]>;
  loadingUsers$?: Observable<boolean>;
  reservationCreated$?: Observable<boolean>;
  reservationCreatedLoader$?: Observable<boolean>;
  selectedUser?: ClubUser;
  private subscription = new Subscription();

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
    private store: Store<AppState>,
    private dialogRef: MatDialogRef<CreateReservationFromTableModalComponent>
  ) {}

  ngOnInit() {
    this.openModal();
    this.initializeSelectors();
    this.setupUserControl();
    this.subscribeToModalState();
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
  }

  private setupUserControl() {
    this.subscription.add(
      this.userControl.valueChanges
        .pipe(
          debounceTime(300),
          startWith(''),
          tap((searchTerm) =>
            this.store.dispatch(getClubUserByNameOrId({ nameOrId: searchTerm }))
          )
        )
        .subscribe()
    );
  }

  private subscribeToModalState() {
    this.subscription.add(
      this.store
        .pipe(select(isModalOpen('createReservationFromTableModal')))
        .subscribe((isOpen) => {
          if (!isOpen) {
            this.dialogRef.close();
          }
        })
    );

    this.subscription.add(
      this.reservationCreated$?.subscribe((created) => {
        if (created) {
          this.closeModal();
        }
      })
    );
  }

  onUserSelected(user: ClubUser) {
    this.selectedUser = user;
  }

  displayUserName(user?: ClubUser): string {
    return user?.completeName || ''; // Using optional chaining for better readability
  }

  createReservation() {
    const { date, hour } = this.data.reservationInfo; // Destructuring for clarity
    const dateTime = this.formatDateTime(date, hour);

    this.store.dispatch(
      createReservationAdmin({
        selecteDates: [dateTime],
        userId: this.selectedUser?.userId?.toString() || '',
      })
    );
  }

  private formatDateTime(date: string, hour: string): string {
    return `${date.replace(/-/g, '/')} ${hour}`;
  }

  closeModal() {
    this.dialogRef.close();
    this.store.dispatch(
      closeModal({ modalId: 'createReservationFromTableModal' })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
