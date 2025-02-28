import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { loadUserProfile } from 'src/app/state/user-profile/user-profile.actions';
import { selectUserProfileStatus } from 'src/app/state/user-profile/user-profile.selectors';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
})
export class UserProfileComponent implements OnInit {
  selectedTab: string = 'matches';
  userId!: number;

  userProfile$ = this.store.select(selectUserProfileStatus);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.userId = Number(params.get('id')); // Get the user ID from the route
      console.log('the user id is : ' + this.userId);

      this.store.dispatch(loadUserProfile({ id: this.userId }));
    });
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
  }
}
