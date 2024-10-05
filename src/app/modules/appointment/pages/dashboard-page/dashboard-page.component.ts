import { Observable } from 'rxjs';
import { UserService } from './../../../../services/user.service';
import { Component, OnInit } from '@angular/core';
import {
  ReservationDetail,
  UserReservationResponse,
} from 'src/app/models/UserReservations.model';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';
import { Store } from '@ngrx/store';
import {
  selectListReservations,
  selectReservationLoading,
} from 'src/app/state/selectors/reservetions.selectors';
import { loadReservations } from 'src/app/state/actions/reservations.actions';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
})
export class DashboardPageComponent implements OnInit {
  userReservations: ReservationDetail[] = [];

  userReservations$: Observable<ReservationDetail[]> = new Observable();

  loadingReservations$: Observable<boolean> = new Observable();

  constructor(private store: Store<any>) {}
  ngOnInit(): void {
    this.loadingReservations$ = this.store.select(selectReservationLoading);
    this.userReservations$ = this.store.select(selectListReservations);
    this.store.dispatch(loadReservations());
  }
}
