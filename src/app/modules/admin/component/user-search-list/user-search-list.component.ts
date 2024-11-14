import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil, tap } from 'rxjs/operators';

import { AppState } from 'src/app/state/app.state';
import { ClubUser } from 'src/app/models/clubUsers.model';
import { LightUser } from 'src/app/models/LightUser.model';
import { getClubUserByNameOrId } from 'src/app/state/actions/club.actions';
import {
  selectClubUsers,
  selectLoadingClubUsers,
} from 'src/app/state/selectors/club.selectors';
import { CreateLightUserModalComponent } from '../../modals/create-light-user-modal/create-light-user-modal.component';

@Component({
  selector: 'app-user-search-list',
  templateUrl: './user-search-list.component.html',
  styleUrls: ['./user-search-list.component.css'],
})
export class UserSearchListComponent implements OnInit, OnDestroy {
  @Output() userSelected = new EventEmitter<ClubUser | LightUser>();

  loadingUsers$ = this.store.select(selectLoadingClubUsers);
  filteredUsers$ = this.store.select(selectClubUsers);

  userControl = new FormControl();
  selectedUser?: ClubUser;
  lightUser: LightUser | null = null;
  isnewUser = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly store: Store<AppState>,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.setupUserSearch();
  }

  private setupUserSearch(): void {
    this.userControl.valueChanges
      .pipe(
        debounceTime(500),
        tap((searchTerm) => this.searchUserIfNeeded(searchTerm)),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private searchUserIfNeeded(searchTerm: string | null): void {
    if (!this.selectedUser && searchTerm) {
      this.store.dispatch(getClubUserByNameOrId({ nameOrId: searchTerm }));
    }
  }

  onUserSelected(user: ClubUser): void {
    this.selectedUser = user;
    this.userSelected.emit(user);
  }

  displayUserName(user?: ClubUser): string {
    return user?.completeName ?? '';
  }

  trackByUserId(index: number, user: ClubUser): number {
    return user.userId ?? 0;
  }

  openCreateUserModal(): void {
    const dialogRef = this.dialog.open(CreateLightUserModalComponent, {
      width: '400px',
      data: {},
    });

    dialogRef.afterClosed().subscribe((result: LightUser) => {
      if (result) {
        this.setNewLightUser(result);
      }
    });
  }

  private setNewLightUser(result: LightUser): void {
    const newUser: ClubUser = {
      userId: null,
      userIdentification: result.email,
      completeName: `${result.name} ${result.lastName}`,
    };

    this.selectedUser = newUser;
    this.userControl.setValue(newUser);
    this.isnewUser = true;
    this.lightUser = result;
    this.userSelected.emit(newUser);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
