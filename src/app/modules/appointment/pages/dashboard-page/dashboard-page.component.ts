import { UserService } from './../../../../services/user.service';
import { Component, OnInit } from '@angular/core';
import {
  ReservationDetail,
  UserReservationResponse,
} from 'src/app/models/UserReservations.model';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
})
export class DashboardPageComponent {
  userReservations: ReservationDetail[] = [];

  reservations$ = this.userService.reservations$;

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}
}
