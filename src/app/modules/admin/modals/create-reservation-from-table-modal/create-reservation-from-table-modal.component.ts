import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import {
  map,
  startWith,
  switchMap,
  debounceTime,
  catchError,
} from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { ClubUser } from 'src/app/models/clubUsers.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { createReservationAdmin } from 'src/app/state/actions/club.actions';
import { of } from 'rxjs';

@Component({
  selector: 'app-create-reservation-from-table-modal',
  templateUrl: './create-reservation-from-table-modal.component.html',
})
export class CreateReservationFromTableModalComponent
  implements OnInit, OnDestroy
{
  userControl = new FormControl();
  users: ClubUser[] = [];
  filteredUsers$: Observable<ClubUser[]> | undefined;
  selectedUser: ClubUser | undefined;
  private subscriptions: Subscription = new Subscription();

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
    private userService: UserService,
    private dialogRef: MatDialogRef<CreateReservationFromTableModalComponent>,
    private store: Store<any>
  ) {}

  ngOnInit() {
    this.filteredUsers$ = this.userControl.valueChanges.pipe(
      debounceTime(200),
      startWith(''),
      switchMap((value) => this._filterUsers(value))
    );

    // Fetch all users on init
    this.subscriptions.add(
      this.userService.getClubUserByNameOrId('').subscribe((users) => {
        this.users = users;
      })
    );
  }

  private _filterUsers(value: string): Observable<ClubUser[]> {
    const filterValue = value ? value.toLowerCase() : '';
    return this.userService.getClubUserByNameOrId(filterValue).pipe(
      map((users) =>
        users.filter((user) =>
          user.completeName.toLowerCase().includes(filterValue)
        )
      ),
      catchError(() => of([])) // Handle any errors gracefully by returning an empty array
    );
  }

  onUserSelected(user: ClubUser) {
    this.selectedUser = user;
  }

  displayUserName(user?: ClubUser): string {
    return user ? user.completeName : '';
  }

  createReservation() {
    const formattedDate = this.data.reservationInfo.date.replace(/-/g, '/');
    const dateTime = `${formattedDate} ${this.data.reservationInfo.hour}`;

    this.store.dispatch(
      createReservationAdmin({
        selecteDates: [dateTime],
        userId: this.selectedUser?.userId?.toString() || '',
      })
    );

    this.dialogRef.close();
  }

  closeModal() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe(); // Clean up subscriptions
  }
}
