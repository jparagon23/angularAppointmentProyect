import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadUser } from 'src/app/state/actions/users.actions';
import {
  selectUser,
  selectUsersLoading,
} from 'src/app/state/selectors/users.selectors';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
})
export class LayoutComponent implements OnInit {
  constructor(private store: Store<any>, private router: Router) {}
  userLoading$ = this.store.select(selectUsersLoading);
  ngOnInit(): void {
    this.store.dispatch(loadUser());

    this.userLoading$.subscribe((isLoading) => {
      if (!isLoading) {
        this.store.select(selectUser).subscribe((user) => {
          if (user?.role == 2) {
            console.log('User is admin, redirecting to admin dashboard');
            this.router.navigate(['home/admin/dashboard']);
          } else {
            console.log('User is not admin, redirecting to user dashboard');
            this.router.navigate(['home/dashboard']);
          }
        });
      }
    });
  }
}
