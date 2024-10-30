import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-club-configuration-page',
  templateUrl: './club-configuration-page.component.html',
})
export class ClubConfigurationPageComponent {
  selectedTab: 'courts' | 'availability' | 'cancellation' = 'courts';

  selectTab(tab: 'courts' | 'availability' | 'cancellation'): void {
    this.selectedTab = tab;
  }
}
