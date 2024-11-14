import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ClubUser } from 'src/app/models/clubUsers.model';
import { LightUser } from 'src/app/models/LightUser.model';
import { UserListReturn } from 'src/app/models/UserListReturn.model';

@Component({
  selector: 'app-user-name-make-reservation-modal',
  templateUrl: './user-name-make-reservation-modal.component.html',
  styleUrls: ['./user-name-make-reservation-modal.component.css'],
})
export class UserNameMakeReservationModalComponent {
  userReturn!: UserListReturn | null;
  selectedUser?: ClubUser;
  lightUser: LightUser | null = null;

  constructor(
    private readonly dialogRef: MatDialogRef<UserNameMakeReservationModalComponent>
  ) {}

  onUserSelected(user: UserListReturn | null) {
    this.userReturn = user;
  }

  onClickReservate() {
    this.dialogRef.close(this.userReturn);
  }
}
