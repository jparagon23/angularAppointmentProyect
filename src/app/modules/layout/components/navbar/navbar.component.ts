import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {
  faBell,
  faInfoCircle,
  faClose,
  faAngleDown,
  faUser,
  faBars, // New icon for hamburger menu
} from '@fortawesome/free-solid-svg-icons';

import { MatDialog } from '@angular/material/dialog';

import { MakeReservationModalComponent } from 'src/app/modules/appointment/modals/make-reservation-modal/make-reservation-modal.component';
import { filter, Observable } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { Store } from '@ngrx/store';
import { selectUser } from 'src/app/state/selectors/users.selectors';
import { distinctUntilChanged } from 'rxjs/operators';
import { logout } from 'src/app/state/actions/auth.actions';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  faBell = faBell;
  faInfoCircle = faInfoCircle;
  faClose = faClose;
  faAngleDown = faAngleDown;
  faUser = faUser;
  faBars = faBars; // New icon for hamburger menu

  isOpenOverlayAvatar = false;
  isOpenOverlayBoards = false;
  isOpenMobileMenu = false; // New property for mobile menu state

  user$: Observable<User> = new Observable<User>();

  constructor(
    public dialog: MatDialog,
    private readonly store: Store<any>,
    private readonly router: Router
  ) {}

  logout() {
    this.store.dispatch(logout());
  }

  OpenDialog(): void {
    this.dialog.open(MakeReservationModalComponent, {
      maxWidth: '95vw',
      maxHeight: '95vh',
    });
  }

  toggleMobileMenu() {
    this.isOpenMobileMenu = !this.isOpenMobileMenu; // Function to toggle mobile menu
  }

  ngOnInit(): void {
    this.user$ = this.store.select(selectUser).pipe(
      filter((user): user is User => user !== null),
      distinctUntilChanged()
    );
  }

  redirectToFieldComponent() {
    this.router.navigate(['home/admin/courts']);
  }

  redirectToDashboard() {
    this.router.navigate(['home/admin']);
  }
}
