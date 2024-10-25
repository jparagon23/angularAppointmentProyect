import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {
  faBell,
  faInfoCircle,
  faClose,
  faAngleDown,
  faUser,
  faBars,
} from '@fortawesome/free-solid-svg-icons';

import { MatDialog } from '@angular/material/dialog';

import { MakeReservationModalComponent } from 'src/app/modules/appointment/modals/make-reservation-modal/make-reservation-modal.component';
import { filter, Observable } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { Store } from '@ngrx/store';
import { selectUser } from 'src/app/state/selectors/users.selectors';
import { distinctUntilChanged } from 'rxjs/operators';
import { logout } from 'src/app/state/actions/auth.actions';

interface ButtonConfig {
  label: string;
  role: number; // role number associated with the button
  action: () => void; // function to be called when the button is clicked
}

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
  faBars = faBars;

  isOpenOverlayAvatar = false;
  isOpenMobileMenu = false;

  user$: Observable<User> = new Observable<User>();

  // Define button configurations
  buttonConfigs: ButtonConfig[] = [];

  constructor(
    public dialog: MatDialog,
    private readonly store: Store<any>,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.user$ = this.store.select(selectUser).pipe(
      filter((user): user is User => user !== null),
      distinctUntilChanged()
    );

    // Initialize button configurations based on user roles
    this.user$.subscribe((user) => {
      if (user) {
        this.initializeButtons(user.role);
      }
    });
  }

  initializeButtons(userRole: number): void {
    this.buttonConfigs = [
      {
        label: 'Inicio',
        role: 2,
        action: () => this.redirectToDashboard(),
      },
      {
        label: 'Crear Reserva',
        role: 1,
        action: () => this.OpenDialog(),
      },
    ];

    // Filter buttons that match the user's role
    this.buttonConfigs = this.buttonConfigs.filter(
      (config) => config.role === userRole
    );
  }

  logout() {
    this.store.dispatch(logout());
  }

  OpenDialog(): void {
    this.dialog.open(MakeReservationModalComponent, {
      maxWidth: '95vw',
      maxHeight: '95vh',
    });
  }

  redirectToDashboard() {
    this.user$.subscribe((user) => {
      if (user.role === 2) {
        this.router.navigate(['home/admin']);
      }
      if (user.role === 1) {
        this.router.navigate(['home/user']);
      }
    });
  }

  redirectToConfigurationComponent() {
    this.router.navigate(['home/admin/configuration']);
  }

  redirectToUserInformation() {
    this.user$.subscribe((user) => {
      if (user.role === 2) {
        this.router.navigate(['home/admin/user-information']);
      }
      if (user.role === 1) {
        this.router.navigate(['home/user/user-information']);
      }
    });
  }
}
