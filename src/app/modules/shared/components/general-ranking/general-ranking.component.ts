import { Component, Input } from '@angular/core';
import { GeneralRanking } from 'src/app/models/events/RankingInfo.model';

@Component({
  selector: 'app-general-ranking',
  templateUrl: './general-ranking.component.html',
})
export class GeneralRankingComponent {
  @Input() genralRanking: GeneralRanking = {
    singleRanking: [],
    doublesRanking: [],
  };
  @Input() title: string = 'Ranking General';
  rankingTab: string = 'SINGLES';
}
