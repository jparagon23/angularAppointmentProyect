import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { debounceTime, startWith, tap } from 'rxjs/operators';
import { ClubUser } from 'src/app/models/clubUsers.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  selectClubUsers,
  selectLoadingClubUsers,
  selectReservationCreated,
} from 'src/app/state/selectors/club.selectors';
import {
  createReservationAdmin,
  getClubUserByNameOrId,
} from 'src/app/state/actions/club.actions';
import { AppState } from 'src/app/state/app.state';

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
  selectedUser: ClubUser | undefined;

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
    // Selectors to get users, loading state, and reservation creation state from store
    this.filteredUsers$ = this.store.select(selectClubUsers);
    this.loadingUsers$ = this.store.select(selectLoadingClubUsers);
    this.reservationCreated$ = this.store.select(selectReservationCreated);

    // Handle user input changes to trigger user search
    this.userControl.valueChanges
      .pipe(
        debounceTime(200),
        startWith(''),
        tap((searchTerm) => {
          // Dispatch action to fetch users based on input
          this.store.dispatch(getClubUserByNameOrId({ nameOrId: searchTerm }));
        })
      )
      .subscribe();
  }

  // Handle user selection
  onUserSelected(user: ClubUser) {
    this.selectedUser = user;
  }

  // Display selected user's name
  displayUserName(user?: ClubUser): string {
    return user ? user.completeName : '';
  }

  // Create reservation for the selected user
  createReservation() {
    const formattedDate = this.data.reservationInfo.date.replace(/-/g, '/');
    const dateTime = `${formattedDate} ${this.data.reservationInfo.hour}`;

    // Dispatch action to create reservation
    this.store.dispatch(
      createReservationAdmin({
        selecteDates: [dateTime],
        userId: this.selectedUser?.userId?.toString() || '',
      })
    );

    // Close the modal once the reservation is created successfully
    this.reservationCreated$?.subscribe((created) => {
      if (created) {
        this.dialogRef.close();
      }
    });
  }

  // Close modal without creating a reservation
  closeModal() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    // No need to manually unsubscribe from store since the observables are managed by the store
  }
}
