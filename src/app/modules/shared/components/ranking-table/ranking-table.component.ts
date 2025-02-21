import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { RankingInfo } from 'src/app/models/events/RankingInfo.model';
import { selectUser } from 'src/app/state/selectors/users.selectors';

@Component({
  selector: 'app-ranking-table',
  templateUrl: './ranking-table.component.html',
})
export class RankingTableComponent implements OnInit {
  @Input() ratings: RankingInfo[] = [];

  user$ = this.store.select(selectUser);
  isLoading = true;

  constructor(private readonly store: Store<any>) {}

  ngOnInit(): void {
    this.user$.subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }
}
