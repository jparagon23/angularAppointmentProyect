import { Observable, combineLatest, Subject } from 'rxjs';
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
import { selectRankingState } from 'src/app/state/selectors/event.selectors';
import { UserMatch } from 'src/app/models/events/UserMatch.model';
import { selectUser } from 'src/app/state/selectors/users.selectors';
import { User } from 'src/app/models/user.model';
import { takeUntil } from 'rxjs/operators';
import { selectDashboardState } from 'src/app/state/dashboard-state/dashboard.selectors';
import { ChallengeResponseDTO } from 'src/app/models/challenges/UserChallenges.model';
import { ChallengeModalComponent } from 'src/app/modules/match/modals/challenge-modal/challenge-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { PostMatchComponent } from 'src/app/modules/match/modals/post-match/post-match.component';
import { selectUserChallengesState } from 'src/app/state/challenges/challenges.selectos';

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

  selectGeneralRankingStatus$ = this.store.select(selectRankingState);

  selectDashboardState$ = this.store.select(selectDashboardState);

  selectUserChallengesState$ = this.store.select(selectUserChallengesState);

  matchType: string = 'SINGLES';

  rankingTab: string = 'SINGLES';
  confirmedMatches: UserMatch[] = [];
  pendingMatches: UserMatch[] = [];

  orderChallenge: ChallengeResponseDTO[] = [];

  confirmedSliceLimit = 6;
  pendingSliceLimit = 6;
  initialLimit = 6;

  private isLoading = false;
  private readonly destroy$ = new Subject<void>();

  constructor(private readonly store: Store<any>, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.handleCancelReservationSuccess();
    this.handleCancelReservationFailure();
    this.trackLoadingState();

    combineLatest([
      this.user$,
      this.selectDashboardState$,
      this.selectUserChallengesState$,
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([user, dashboardState, challenges]) => {
        if (user?.id) {
          const singles = dashboardState.last10SinglesMatches ?? [];
          const doubles = dashboardState.last10DoublesMatches ?? [];
          const userMatches = this.matchType === 'SINGLES' ? singles : doubles;

          const allUserMatches = [...singles, ...doubles];

          if (userMatches) {
            this.filterMatches(userMatches, user.id);
            this.filterPendingMatches(allUserMatches, user.id);
          }

          this.orderChallenge = this.orderPendingChallenges(
            challenges.userChallenges,
            user.id
          );
        }
      });
  }

  private orderPendingChallenges(
    userChallenges: ChallengeResponseDTO[],
    userId: number
  ): ChallengeResponseDTO[] {
    const pendingConfirmation = userChallenges.filter(
      (c) =>
        c.status === 'PENDING' && c.pendingConfirmationUsers.includes(userId)
    );

    const pendingScore = userChallenges.filter(
      (c) => c.status === 'PENDING_SCORE'
    );

    const accepted = userChallenges.filter((c) => c.status === 'ACCEPTED');

    const others = userChallenges.filter(
      (c) =>
        !(
          (c.status === 'PENDING' &&
            c.pendingConfirmationUsers.includes(userId)) ||
          c.status === 'PENDING_SCORE' ||
          c.status === 'ACCEPTED'
        )
    );

    return [...pendingConfirmation, ...pendingScore, ...accepted, ...others];
  }

  private filterPendingMatches(userMatches: UserMatch[], userId: number): void {
    this.pendingMatches = userMatches.filter(
      (match) =>
        match.status === 'PENDING' &&
        match.pendingConfirmationUsers?.includes(userId)
    );
  }

  private filterMatches(userMatches: UserMatch[], userId: number): void {
    this.confirmedMatches = userMatches.filter(
      (match) =>
        (match.status === 'CONFIRMED' && match.matchType === this.matchType) ||
        (match.status === 'AUTO_APPROVED' &&
          match.matchType === this.matchType) ||
        (match.status === 'PENDING' &&
          match.pendingConfirmationUsers &&
          !match.pendingConfirmationUsers.includes(userId) &&
          match.matchType === this.matchType)
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
    this.user$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      if (user?.id) {
        this.selectDashboardState$
          .pipe(takeUntil(this.destroy$))
          .subscribe((dashboardState) => {
            const userMatches =
              this.matchType === 'SINGLES'
                ? dashboardState.last10SinglesMatches
                : dashboardState.last10DoublesMatches;

            if (userMatches) {
              this.filterMatches(userMatches, user.id);
            }
          });
      }
    });
  }

  createChallenge() {
    this.dialog.open(ChallengeModalComponent, {
      maxWidth: '95vw',
      maxHeight: '95vh',
      panelClass: 'custom-dialog-container',
    });
  }
  createMatchResult() {
    this.dialog.open(PostMatchComponent, {
      maxWidth: '95vw',
      maxHeight: '95vh',
      panelClass: 'custom-dialog-container',
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
