import { Observable, Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ReservationDetail } from 'src/app/models/UserReservations.model';
import { Store } from '@ngrx/store';
import {
  selectCancelReservationFailure,
  selectCancelReservationLoading,
  selectCancelReservationSuccess,
  selectListReservations,
  selectReservationLoading,
} from 'src/app/state/selectors/reservetions.selectors';
import {
  loadReservations,
  resetCancelReservationState,
} from 'src/app/state/actions/reservations.actions';
import Swal from 'sweetalert2';
import { loadCourts } from 'src/app/state/actions/clubConfiguration.actions';
import { selectGetUserMatchesStatus } from 'src/app/state/selectors/event.selectors';
import { loadUser } from 'src/app/state/actions/users.actions';
import { getUserMatches } from 'src/app/state/actions/event.actions';
import { UserMatch } from 'src/app/models/events/UserMatch.model';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
})
export class DashboardPageComponent implements OnInit {
  userReservations: ReservationDetail[] = [];

  userReservations$: Observable<ReservationDetail[]> = new Observable();

  loadingReservations$: Observable<boolean> = new Observable();

  cancelReservationSuccess$: Observable<boolean> = this.store.select(
    selectCancelReservationSuccess
  );
  cancelReservationFailure$: Observable<boolean> = this.store.select(
    selectCancelReservationFailure
  );

  cancelReservationLoader$: Observable<boolean> = this.store.select(
    selectCancelReservationLoading
  );

  selectGetUserMatchesStatus$ = this.store.select(selectGetUserMatchesStatus);

  private isLoading = false;

  private readonly subscriptions = new Subscription();
  sliceLimit = 4;
  initialLimit = 4;
  increment = 6;

  constructor(private readonly store: Store<any>) {}
  ngOnInit(): void {
    this.loadingReservations$ = this.store.select(selectReservationLoading);
    this.userReservations$ = this.store.select(selectListReservations);
    this.store.dispatch(loadReservations());

    this.handleCancelReservationSuccess();
    this.handleCancelReservationFailure();
    this.trackLoadingState();

    this.store.dispatch(getUserMatches());
  }

  private handleCancelReservationSuccess(): void {
    this.subscriptions.add(
      this.cancelReservationSuccess$.subscribe((success) => {
        if (success) {
          Swal.fire({
            icon: 'success',
            title: 'Reserva cancelada',
            text: 'Tu reserva ha sido cancelada exitosamente.',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK',
          }).then(() => {
            this.store.dispatch(resetCancelReservationState());
          });
        }
      })
    );
  }

  private handleCancelReservationFailure(): void {
    this.subscriptions.add(
      this.cancelReservationFailure$.subscribe((failure) => {
        if (failure) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo cancelar la reserva. Inténtalo de nuevo.',
            confirmButtonColor: '#d33',
            confirmButtonText: 'OK',
          }).then(() => {
            this.store.dispatch(resetCancelReservationState());
          });
        }
      })
    );
  }

  private trackLoadingState(): void {
    this.subscriptions.add(
      this.cancelReservationLoader$.subscribe((loading) => {
        loading ? this.showLoadingSpinner() : this.hideLoadingSpinner();
      })
    );
  }

  private showLoadingSpinner(): void {
    if (this.isLoading) return;
    this.isLoading = true;
    Swal.fire({
      title: 'Cancelando reserva...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });
  }

  private hideLoadingSpinner(): void {
    if (!this.isLoading) return;
    this.isLoading = false;
  }
  toggleResults(event: Event, matchesData: UserMatch[]): void {
    event.preventDefault(); // Evita el comportamiento por defecto del enlace
    if (this.sliceLimit < matchesData.length) {
      // Mostrar más resultados
      this.sliceLimit = matchesData.length;
    } else {
      // Volver al límite inicial
      this.sliceLimit = this.initialLimit;
    }
  }
}
