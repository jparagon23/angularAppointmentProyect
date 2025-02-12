import { Component, Input } from '@angular/core';
import { RankingInfo } from 'src/app/models/events/RankingInfo.model';

@Component({
  selector: 'app-ranking-table',
  templateUrl: './ranking-table.component.html',
})
export class RankingTableComponent {
  @Input() ratings: RankingInfo[] = [];
}
