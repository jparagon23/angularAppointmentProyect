import { Component } from '@angular/core';

@Component({
  selector: 'app-matches-page',
  templateUrl: './matches-page.component.html',
})
export class MatchesPageComponent {
  selectedTab: 'matches' | 'stats' = 'matches';

  selectTab(tab: 'matches' | 'stats'): void {
    this.selectedTab = tab;
  }
}
