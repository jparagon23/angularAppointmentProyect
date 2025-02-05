import { Component, OnChanges } from '@angular/core';

@Component({
  selector: 'app-matches-page',
  templateUrl: './matches-page.component.html',
})
export class MatchesPageComponent {
  selectedTab: 'matches' | 'stats' = 'matches';
  matchType: 'SINGLES' | 'DOUBLES' = 'SINGLES';

  selectTab(tab: 'matches' | 'stats'): void {
    this.selectedTab = tab;
  }

  selectMatchTab(tab: 'SINGLES' | 'DOUBLES'): void {
    this.matchType = tab;
  }
}
