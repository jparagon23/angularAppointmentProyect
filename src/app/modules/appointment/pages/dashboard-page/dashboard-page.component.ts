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
import { resetCancelReservationState } from 'src/app/state/actions/reservations.actions';
import Swal from 'sweetalert2';
import { selectGetUserMatchesStatus } from 'src/app/state/selectors/event.selectors';
import { UserMatch } from 'src/app/models/events/UserMatch.model';
import { selectUser } from 'src/app/state/selectors/users.selectors';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
})
export class DashboardPageComponent implements OnInit {
  user$: Observable<User | null> = this.store.select(selectUser);
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
  confirmedSliceLimit = 6;
  pendingSliceLimit = 6;
  initialLimit = 6;

  // Variables para almacenar los partidos confirmados y pendientes
  confirmedMatches: UserMatch[] = [];
  pendingMatches: UserMatch[] = [];

  constructor(private readonly store: Store<any>) {}

  ngOnInit(): void {
    this.loadingReservations$ = this.store.select(selectReservationLoading);
    this.userReservations$ = this.store.select(selectListReservations);

    this.handleCancelReservationSuccess();
    this.handleCancelReservationFailure();
    this.trackLoadingState();

    // Filtrar los partidos confirmados y pendientes al obtener los datos de los partidos
    this.subscriptions.add(
      this.selectGetUserMatchesStatus$.subscribe((matchesData) => {
        if (matchesData?.userMatch) {
          // Suscribirse al userId$ para obtener el userId y luego filtrar los partidos
          this.user$.subscribe((user) => {
            if (user?.id !== undefined) {
              this.filterMatches(matchesData.userMatch, user.id); // Pasar userId al filtro
            }
          });
        }
      })
    );
  }

  // Función para filtrar los partidos por estado
  private filterMatches(userMatches: UserMatch[], userId: number): void {
    this.confirmedMatches = userMatches.filter(
      (match) =>
        match.status === 'CONFIRMED' ||
        (match.status === 'PENDING' &&
          match.pendingConfirmationUsers &&
          !match.pendingConfirmationUsers.includes(userId))
    );
    this.pendingMatches = userMatches.filter(
      (match) =>
        match.status === 'PENDING' &&
        match.pendingConfirmationUsers?.includes(userId)
    );
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
  toggleResults(event: Event, section: 'confirmed' | 'pending'): void {
    event.preventDefault(); // Evita el comportamiento por defecto del enlace

    if (section === 'confirmed') {
      // Mostrar más resultados en Partidos Confirmados
      this.confirmedSliceLimit =
        this.confirmedSliceLimit < this.confirmedMatches.length
          ? this.confirmedMatches.length
          : this.initialLimit;
    } else if (section === 'pending') {
      // Mostrar más resultados en Partidos Pendientes
      this.pendingSliceLimit =
        this.pendingSliceLimit < this.pendingMatches.length
          ? this.pendingMatches.length
          : this.initialLimit;
    }
  }
}
