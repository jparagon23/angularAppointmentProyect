import { Component } from '@angular/core';

@Component({
  selector: 'app-matches-page',
  templateUrl: './matches-page.component.html',
})
export class MatchesPageComponent {
  selectedTab: string = 'matches';
  matchType: string = 'SINGLES';

  selectTab(tab: string): void {
    this.selectedTab = tab;
  }

  selectMatchTab(tab: string): void {
    this.matchType = tab;
  }
}
