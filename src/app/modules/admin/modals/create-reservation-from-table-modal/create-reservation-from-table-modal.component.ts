import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { ClubUser } from 'src/app/models/clubUsers.model';
import { debounceTime } from 'rxjs/operators';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { User } from 'src/app/models/user.model';
import { ConfirmationModalComponent } from 'src/app/modules/appointment/modals/confirmation-modal/confirmation-modal.component';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-create-reservation-from-table-modal',
  templateUrl: './create-reservation-from-table-modal.component.html',
})
export class CreateReservationFromTableModalComponent implements OnInit {
  userControl = new FormControl();
  users: ClubUser[] = [];
  filteredUsers: Observable<ClubUser[]> | undefined;
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
    private userService: UserService,
    private createReservationModal: MatDialogRef<CreateReservationFromTableModalComponent>,
    public dialog: MatDialog,
    private store: Store<any>
  ) {}

  ngOnInit() {
    this.userService.getClubUserByNameOrId('').subscribe((users) => {
      this.users = users;
    });

    this.filteredUsers = this.userControl.valueChanges.pipe(
      debounceTime(200), // Wait for the user to stop typing for 300ms
      startWith(''),
      switchMap((value) => this._filter(value))
    );

    console.log(this.data);
  }

  private _filter(value: any): Observable<ClubUser[]> {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
    return this.userService
      .getClubUserByNameOrId(filterValue)
      .pipe(
        map((users) =>
          users.filter((user) =>
            user.completeName.toLowerCase().includes(filterValue)
          )
        )
      );
  }

  onUserSelected(user: ClubUser) {
    this.selectedUser = user;
  }

  displayUserName(user?: ClubUser): string {
    return user ? user.completeName : '';
  }

  createReservation() {
    //this.store.dispatch();
  }

  closeModal() {
    this.createReservationModal.close();
  }
}
