import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ReservationDetail } from 'src/app/models/UserReservations.model';
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

  constructor(private readonly store: Store<any>) {}
  ngOnInit(): void {
    this.loadingReservations$ = this.store.select(selectReservationLoading);
    this.userReservations$ = this.store.select(selectListReservations);
    this.store.dispatch(loadReservations());
  }
}
