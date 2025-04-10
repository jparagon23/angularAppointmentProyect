
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { getActiveClubs } from 'src/app/state/membership/membership.actions';
import { selectMembershipClubs } from 'src/app/state/membership/membership.selectors';
import { take } from 'rxjs/operators';


@Component({
  selector: 'app-clubs-pages',
  templateUrl: './clubs-pages.component.html',
})
export class ClubsPagesComponent implements OnInit {
  selectMembershipClubs$ = this.store.select(selectMembershipClubs);

  constructor(private readonly store: Store<any>) {}

  ngOnInit(): void {
    this.store
      .select(selectMembershipClubs)
      .pipe(take(1))
      .subscribe((membershipClubs) => {
        if (
          !membershipClubs.activeClubs ||
          membershipClubs.activeClubs.length === 0
        ) {
          this.store.dispatch(getActiveClubs());
        }
      });
  }
}

