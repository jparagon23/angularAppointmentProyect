import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadUser } from 'src/app/state/actions/users.actions';
import {
  selectUser,
  selectUsersError,
  selectUsersLoading,
} from 'src/app/state/selectors/users.selectors';
import { combineLatest } from 'rxjs';
import { filter, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
})
export class LayoutComponent implements OnInit {
  userLoading$ = this.store.select(selectUsersLoading);
  userError$ = this.store.select(selectUsersError);
  user$ = this.store.select(selectUser);

  constructor(private store: Store<any>, private router: Router) {}

  ngOnInit(): void {
    this.store.dispatch(loadUser());

    combineLatest([this.userLoading$, this.userError$, this.user$])
      .pipe(
        filter(([isLoading, error, user]) => !isLoading),
        distinctUntilChanged()
      )
      .subscribe(([isLoading, error, user]) => {
        if (error) {
          console.error('Error loading user:', error);
          // Manejar el error, por ejemplo, mostrar un mensaje de error
        } else if (user) {
          if (user.role == 2) {
            this.router.navigate(['home/admin/dashboard']);
          } else {
            this.router.navigate(['home/dashboard']);
          }
        }
      });
  }
}
