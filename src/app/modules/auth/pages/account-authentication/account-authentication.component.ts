import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { faLock } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { setAuthenticationStatus } from 'src/app/state/actions/auth.actions';
import { selectIsAuthenticated } from 'src/app/state/selectors/auth.selectors';

@Component({
  selector: 'app-account-authentication',
  templateUrl: './account-authentication.component.html',
})
export class AccountAuthenticationComponent {
  faLock = faLock;

  isAuthenticated$: Observable<boolean>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store
  ) {
    this.store.dispatch(setAuthenticationStatus({ isAuthenticated: false }));
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
  }

  navigateToLogin() {
    console.log('Navegando al login');
    this.router.navigate(['/login']);
  }
}
