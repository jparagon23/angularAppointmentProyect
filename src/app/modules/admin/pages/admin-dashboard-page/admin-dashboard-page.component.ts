import { Component, OnInit } from '@angular/core';
import { User, UserMatch } from 'src/app/models/events/UserMatch.model';
import { Store } from '@ngrx/store';
import {
  selectAdminPostedMatchesState,
  selectRankingState,
} from 'src/app/state/selectors/event.selectors';
import { loadAdminPostedMatches } from 'src/app/state/actions/event.actions';
import { combineLatest, first, Observable, Subject, takeUntil } from 'rxjs';
import { MembershipDTO } from 'src/app/models/MembershipDTO.model';
import { ClubService } from 'src/app/services/club.service';
import { selectUser } from 'src/app/state/selectors/users.selectors';
import { selectDashboardState } from 'src/app/state/dashboard-state/dashboard.selectors';

@Component({
  selector: 'app-admin-dashboard-page',
  templateUrl: './admin-dashboard-page.component.html',
})
export class AdminDashboardPageComponent implements OnInit {
  user$: Observable<User | null> = this.store.select(selectUser);
  selectDashboardState$ = this.store.select(selectDashboardState);
  private readonly destroy$ = new Subject<void>();
  rankingTab: string = 'SINGLES';
  selectGeneralRankingStatus$ = this.store.select(selectRankingState);
  adminPostedMatchesState$ = this.store.select(selectAdminPostedMatchesState);

  memberships: MembershipDTO[] = [];

  pendingMatches: UserMatch[] = [];

  constructor(
    private readonly store: Store<any>,
    private readonly clubService: ClubService
  ) {}

  ngOnInit(): void {
    this.adminPostedMatchesState$
      .pipe(
        first(
          ({ adminPostedMatches }) =>
            !adminPostedMatches || adminPostedMatches.length === 0
        )
      )
      .subscribe(() => this.store.dispatch(loadAdminPostedMatches()));

    this.clubService.getPendingMembershipRequests().subscribe((memberships) => {
      this.memberships = memberships;
    });

    combineLatest([this.user$, this.selectDashboardState$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([user, dashboardState]) => {
        if (user?.id) {
          const singles = dashboardState.last10SinglesMatches ?? [];
          const doubles = dashboardState.last10DoublesMatches ?? [];

          const allUserMatches = [...singles, ...doubles];

          this.filterPendingMatches(allUserMatches, user.id);
        }
      });
  }

  private filterPendingMatches(userMatches: UserMatch[], userId: number): void {
    console.log(userMatches);

    this.pendingMatches = userMatches.filter(
      (match) =>
        match.status === 'PENDING' &&
        match.pendingConfirmationUsers?.includes(userId)
    );
  }
}
