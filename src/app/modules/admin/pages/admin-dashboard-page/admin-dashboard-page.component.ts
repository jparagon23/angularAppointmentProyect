import { Component, OnInit } from '@angular/core';

import { MatchService } from 'src/app/services/match.service';
import { UserMatch } from 'src/app/models/events/UserMatch.model';
import { Store } from '@ngrx/store';
import { selectRankingState } from 'src/app/state/selectors/event.selectors';

@Component({
  selector: 'app-admin-dashboard-page',
  templateUrl: './admin-dashboard-page.component.html',
})
export class AdminDashboardPageComponent implements OnInit {
  matches: UserMatch[] = [];
  selectGeneralRankingStatus$ = this.store.select(selectRankingState);
  ngOnInit(): void {
    this.matchService.getAdminPostedMatches().subscribe((matches) => {
      this.matches = matches;
    });
  }

  constructor(
    private readonly matchService: MatchService,
    private readonly store: Store<any>
  ) {}
}
