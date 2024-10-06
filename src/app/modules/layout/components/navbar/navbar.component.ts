import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  faBell,
  faInfoCircle,
  faClose,
  faAngleDown,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';

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

  isOpenOverlayAvatar = false;
  isOpenOverlayBoards = false;

  user$: Observable<User> = new Observable<User>();

  constructor(
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog,
    private store: Store<any>
  ) {}

  logout() {
    this.store.dispatch(logout());
  }

  OpenDialog(): void {
    const dialogRef = this.dialog.open(MakeReservationModalComponent, {
      maxWidth: '50vw', // Establece el ancho máximo al 80% del viewport
      maxHeight: '50vh', // Establece la altura máxima al 80% del viewport
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
    });
  }

  ngOnInit(): void {
    console.log('Navbar component initialized');

    this.user$ = this.store.select(selectUser).pipe(
      filter((user): user is User => user !== null),
      distinctUntilChanged()
    );
    this.user$.subscribe((user) => {
      console.log('User data:', user);
    });
  }
}
