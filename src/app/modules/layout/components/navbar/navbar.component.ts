import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {
  faBell,
  faInfoCircle,
  faClose,
  faAngleDown,
  faUser,
  faBars,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';

import { MatDialog } from '@angular/material/dialog';

import { MakeReservationModalComponent } from 'src/app/modules/appointment/modals/make-reservation-modal/make-reservation-modal.component';
import { filter, Observable } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { Store } from '@ngrx/store';
import { selectUser } from 'src/app/state/selectors/users.selectors';
import { distinctUntilChanged, take } from 'rxjs/operators';
import { logout } from 'src/app/state/actions/auth.actions';
import { PostMatchComponent } from 'src/app/modules/match/modals/post-match/post-match.component';
import { NotificationItem } from 'src/app/models/notification/NotificationItem.model';
import { MatchConfirmationModalComponent } from 'src/app/modules/match/modals/match-confirmation-modal/match-confirmation-modal.component';
import { markNotificationAsRead } from 'src/app/state/actions/notification.actions';
import { selectUserNotifications } from 'src/app/state/selectors/notification.selectors';
import { MatchActionModalComponent } from 'src/app/modules/match/modals/match-action-modal/match-action-modal.component';

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
  faTimes = faTimes;

  isOpenOverlayAvatar = false;
  isOpenMobileMenu = false;

  isOpenNotifications = false; // Controla el estado del menú desplegable
  notifications$: Observable<NotificationItem[]> = this.store.select(
    selectUserNotifications
  );

  notifications: NotificationItem[] = [];

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

    this.notifications$.subscribe((notifications) => {
      this.notifications = notifications;
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
      panelClass: 'custom-dialog-container',
    });
  }

  openPostResult(): void {
    this.dialog.open(PostMatchComponent, {
      maxWidth: '95vw',
      maxHeight: '95vh',
      panelClass: 'custom-dialog-container',
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

  redirectToMatchPage() {
    this.router.navigate(['home/user/matches']);
  }

  redirectToConfigurationComponent() {
    this.router.navigate(['home/admin/configuration']);
  }

  redirectToReportComponent() {
    this.router.navigate(['home/admin/reports']);
  }

  redirectToUserInformation(userId?: string) {
    this.user$.pipe(take(1)).subscribe((user) => {
      const id = Number(userId ?? user.id); // Si viene un userId, úsalo; si no, usa el del usuario actual y conviértelo a número

      if (user.role === 2) {
        this.router.navigate(['home/admin/profile', id]);
      } else if (user.role === 1) {
        this.router.navigate(['home/user/profile', id]);
      }
    });
  }

  markAsRead(notification: NotificationItem) {
    this.store.dispatch(
      markNotificationAsRead({ notificationId: notification.id })
    );
  }

  markAllAsRead() {
    this.notifications.forEach((notification) => {
      if (notification.status !== 'READ') return;
      this.markAsRead(notification);
    });
  }
  closeNotifications() {
    // Cierra el menú de notificaciones
    this.isOpenNotifications = false;
  }

  openNotificationModal(notification: NotificationItem) {
    if (
      notification.actionUrl !== null &&
      notification.type === 'MATCH_CONFIRMATION'
    ) {
      this.markAsRead(notification);

      this.dialog.open(MatchConfirmationModalComponent, {
        data: notification,
      });
    } else if (
      notification.actionUrl !== null &&
      (notification.type === 'MATCH_CONFIRMED' ||
        notification.type === 'MATCH_REJECTED')
    ) {
      this.markAsRead(notification);

      this.dialog.open(MatchActionModalComponent, {
        data: notification,
      });
    }
  }

  getUnreadNotificationsCount(): number {
    return this.notifications.filter(
      (notification) => notification.status !== 'READ'
    ).length;
  }
}
