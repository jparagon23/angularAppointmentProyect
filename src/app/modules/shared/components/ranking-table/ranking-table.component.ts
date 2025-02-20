import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { RankingInfo } from 'src/app/models/events/RankingInfo.model';
import { selectUser } from 'src/app/state/selectors/users.selectors';

@Component({
  selector: 'app-ranking-table',
  templateUrl: './ranking-table.component.html',
})
export class RankingTableComponent {
  @Input() ratings: RankingInfo[] = [];

  user$ = this.store.select(selectUser);

  constructor(private readonly store: Store<any>) {}
}
