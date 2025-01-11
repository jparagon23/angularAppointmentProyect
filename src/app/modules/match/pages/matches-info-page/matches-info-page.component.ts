import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectGetUserMatchesStatus } from 'src/app/state/selectors/event.selectors';

@Component({
  selector: 'app-matches-info-page',
  templateUrl: './matches-info-page.component.html',
})
export class MatchesInfoPageComponent {
  selectGetUserMatchesStatus$ = this.store.select(selectGetUserMatchesStatus);

  constructor(private readonly store: Store<any>) {}
}
