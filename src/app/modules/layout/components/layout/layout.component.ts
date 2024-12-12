import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  selectUser,
  selectUsersError,
  selectUsersLoading,
} from 'src/app/state/selectors/users.selectors';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
})
export class LayoutComponent implements OnInit {
  userLoading$ = this.store.select(selectUsersLoading);
  userError$ = this.store.select(selectUsersError);
  user$ = this.store.select(selectUser);

  private readonly isLoggedIn = false;

  constructor(
    private readonly store: Store<any>,
    private readonly router: Router
  ) {}

  ngOnInit(): void {}
}
