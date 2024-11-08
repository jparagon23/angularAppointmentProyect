import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { faLock } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { filter, Observable, tap } from 'rxjs';
import {
  resendAuthenticationCode,
  setAuthenticationStatus,
} from 'src/app/state/actions/auth.actions';
import { selectIsAuthenticated } from 'src/app/state/selectors/auth.selectors';

@Component({
  selector: 'app-account-authentication',
  templateUrl: './account-authentication.component.html',
})
export class AccountAuthenticationComponent {
  faLock = faLock;

  isAuthenticated$: Observable<boolean>;
  isPreRegistered: boolean = false;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly store: Store
  ) {
    this.store.dispatch(setAuthenticationStatus({ isAuthenticated: false }));
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
  }

  ngOnInit(): void {
    // Check if 'pre-registered' is true in the queryParams
    this.route.queryParams.subscribe((params) => {
      this.isPreRegistered = params['pre-registered'] === 'true';
    });

    // Redirect based on authentication status and 'pre-registered' flag
    this.isAuthenticated$
      .pipe(
        filter((isAuthenticated) => isAuthenticated),
        tap(() => {
          if (this.isPreRegistered) {
            // Redirect to a different view if 'pre-registered' is true
            this.router.navigate(['/pre-registration']); // Replace with the desired route
          }
        })
      )
      .subscribe();
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  resendCode() {
    this.store.dispatch(resendAuthenticationCode());
  }
}
