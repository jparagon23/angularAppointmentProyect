import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-club-configuration-page',
  templateUrl: './club-configuration-page.component.html',
})
export class ClubConfigurationPageComponent {
  selectedTab: 'courts' | 'availability' = 'courts';

  selectTab(tab: 'courts' | 'availability'): void {
    this.selectedTab = tab;
  }
}
