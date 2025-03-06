import { Observable, Subscription, combineLatest, Subject } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
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
import {
  selectGetUserMatchesStatus,
  selectRankingState,
} from 'src/app/state/selectors/event.selectors';
import { UserMatch } from 'src/app/models/events/UserMatch.model';
import { selectUser } from 'src/app/state/selectors/users.selectors';
import { User } from 'src/app/models/user.model';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
})
export class DashboardPageComponent implements OnInit, OnDestroy {
  user$: Observable<User | null> = this.store.select(selectUser);
  userReservations$: Observable<ReservationDetail[]> = this.store.select(
    selectListReservations
  );
  loadingReservations$: Observable<boolean> = this.store.select(
    selectReservationLoading
  );
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

  selectGeneralRankingStatus$ = this.store.select(selectRankingState);

  matchType: string = 'SINGLES';

  rankingTab: string = 'SINGLES';
  confirmedMatches: UserMatch[] = [];
  pendingMatches: UserMatch[] = [];

  confirmedSliceLimit = 6;
  pendingSliceLimit = 6;
  initialLimit = 6;

  private isLoading = false;
  private readonly destroy$ = new Subject<void>();

  constructor(private readonly store: Store<any>) {}

  ngOnInit(): void {
    this.handleCancelReservationSuccess();
    this.handleCancelReservationFailure();
    this.trackLoadingState();

    // Manejo de los partidos confirmados y pendientes sin suscripciones anidadas
    combineLatest([this.user$, this.selectGetUserMatchesStatus$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([user, matchesData]) => {
        if (user?.id && matchesData?.userMatch) {
          this.filterMatches(matchesData.userMatch, user.id);
        }
      });
  }

  private filterMatches(userMatches: UserMatch[], userId: number): void {
    this.confirmedMatches = userMatches.filter(
      (match) =>
        (match.status === 'CONFIRMED' && match.matchType === this.matchType) ||
        (match.status === 'PENDING' &&
          match.pendingConfirmationUsers &&
          !match.pendingConfirmationUsers.includes(userId) &&
          match.matchType === this.matchType)
    );
    this.pendingMatches = userMatches.filter(
      (match) =>
        match.status === 'PENDING' &&
        match.pendingConfirmationUsers?.includes(userId)
    );
  }

  private handleCancelReservationSuccess(): void {
    this.cancelReservationSuccess$
      .pipe(takeUntil(this.destroy$))
      .subscribe((success) => {
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
      });
  }

  private handleCancelReservationFailure(): void {
    this.cancelReservationFailure$
      .pipe(takeUntil(this.destroy$))
      .subscribe((failure) => {
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
      });
  }

  private trackLoadingState(): void {
    this.cancelReservationLoader$
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading) => {
        loading ? this.showLoadingSpinner() : this.hideLoadingSpinner();
      });
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
    event.preventDefault();

    if (section === 'confirmed') {
      this.confirmedSliceLimit =
        this.confirmedSliceLimit < this.confirmedMatches.length
          ? this.confirmedMatches.length
          : this.initialLimit;
    } else {
      this.pendingSliceLimit =
        this.pendingSliceLimit <= this.pendingMatches.length
          ? this.pendingMatches.length
          : this.initialLimit;
    }
  }

  selectMatchTab(tab: string): void {
    this.matchType = tab;

    // Refiltrar los partidos al cambiar de pestaña
    this.user$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      if (user?.id) {
        this.selectGetUserMatchesStatus$
          .pipe(takeUntil(this.destroy$))
          .subscribe((matchesData) => {
            if (matchesData?.userMatch) {
              this.filterMatches(matchesData.userMatch, user.id);
            }
          });
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
