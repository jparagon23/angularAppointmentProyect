import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { of, Subject } from 'rxjs';
import { debounceTime, takeUntil, tap, map, distinctUntilChanged, filter } from 'rxjs/operators';

import { AppState } from 'src/app/state/app.state';
import { ClubUser } from 'src/app/models/clubUsers.model';
import { LightUser } from 'src/app/models/LightUser.model';
import { getClubUserByNameOrId } from 'src/app/state/actions/club.actions';
import {
  selectClubUsers,
  selectLoadingClubUsers,
} from 'src/app/state/selectors/club.selectors';
import { CreateLightUserModalComponent } from '../../../admin/modals/create-light-user-modal/create-light-user-modal.component';
import { UserListReturn } from 'src/app/models/UserListReturn.model';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-user-search-list',
  templateUrl: './user-search-list.component.html',
})
export class UserSearchListComponent implements OnInit, OnDestroy {
  @Output() userReturn = new EventEmitter<UserListReturn | null>();
  @Input() allowCreateUser = true;
  @Input() filterUserStatus = [2, 7]; // Default filter for roles 2 and 7.
  @Input() message: string = 'Empieza a escribir';
  @Input() showIcon: boolean = false;
  faSearch = faSearch;

  private userCache = new Map<string, ClubUser[]>();

  loadingUsers$ = this.store.select(selectLoadingClubUsers);
  filteredUsers$ = this.store.select(selectClubUsers).pipe(
    // Filter users based on the selected roles
    map((users) => this.filterUsersByRole(users))
  );

  userControl = new FormControl();
  selectedUser?: ClubUser;
  lightUser: LightUser | null = null;
  isnewUser = false;
  queryCompleted = false; // Track query completion

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
        debounceTime(400), // Lower debounce time for faster response
        distinctUntilChanged(), // Ignore repeated searches
        filter(searchTerm => !!searchTerm && searchTerm.length >= 3), // Prevent short or empty searches
        tap(searchTerm => {
          this.queryCompleted = false;
          this.searchUserIfNeeded(searchTerm); // No need to check length again
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  
      this.filteredUsers$.pipe(
        tap(users => {
          const searchTerm = this.userControl.value;
          if (searchTerm) {
            this.userCache.set(searchTerm, users);
          }
        }),
        takeUntil(this.destroy$)
      ).subscribe();
      
  }
  
  private searchUserIfNeeded(searchTerm: string): void {
    if (this.selectedUser) return;
  
    if (this.userCache.has(searchTerm)) {
      this.filteredUsers$ = of(this.userCache.get(searchTerm)!);
      this.queryCompleted = true;
    } else {
      this.store.dispatch(getClubUserByNameOrId({ nameOrId: searchTerm }));
    }
  } 


  onUserSelected(user: ClubUser): void {
    this.selectedUser = user;

    this.userReturn.emit({
      userId: this.selectedUser?.userId?.toString() ?? '',
      completeName: this.selectedUser?.completeName ?? '',
      profileImage: this.selectedUser?.profileImage ?? '',
      lightUser: this.selectedUser?.userId ? null : this.lightUser,
    });

    this.userControl.setValue(''); // 🔹 Limpiar el input después de seleccionar un usuario
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
      profileImage: '',
      userStatus: 0,
    };

    this.selectedUser = newUser;
    this.userControl.setValue(newUser);
    this.isnewUser = true;
    this.lightUser = result;
    this.userReturn.emit({
      userId: this.selectedUser?.userId?.toString() ?? '',
      lightUser: this.selectedUser?.userId ? null : this.lightUser,
      completeName: this.selectedUser?.completeName ?? '',
      profileImage: '',
    });
  }

  // New method to filter users based on roles
  private filterUsersByRole(users: ClubUser[]): ClubUser[] {
    // Only filter if filterUserStatus is not empty
    if (this.filterUserStatus.length > 0) {
      return users.filter((user) =>
        this.filterUserStatus.includes(user.userStatus)
      );
    } else {
      return users; // Return all users if no filter is applied
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
