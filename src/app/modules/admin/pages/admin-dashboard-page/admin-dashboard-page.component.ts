import { Component, OnInit } from '@angular/core';
import { UserMatch } from 'src/app/models/events/UserMatch.model';
import { Store } from '@ngrx/store';
import {
  selectAdminPostedMatchesState,
  selectRankingState,
} from 'src/app/state/selectors/event.selectors';
import { loadAdminPostedMatches } from 'src/app/state/actions/event.actions';
import { first, take } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard-page',
  templateUrl: './admin-dashboard-page.component.html',
})
export class AdminDashboardPageComponent implements OnInit {
  matches: UserMatch[] = [];
  rankingTab: string = 'SINGLES';
  selectGeneralRankingStatus$ = this.store.select(selectRankingState);
  adminPostedMatchesState$ = this.store.select(selectAdminPostedMatchesState);

  constructor(private readonly store: Store<any>) {}

  ngOnInit(): void {
    this.adminPostedMatchesState$
      .pipe(
        first(
          ({ adminPostedMatches }) =>
            !adminPostedMatches || adminPostedMatches.length === 0
        )
      )
      .subscribe(() => this.store.dispatch(loadAdminPostedMatches()));
  }
}
