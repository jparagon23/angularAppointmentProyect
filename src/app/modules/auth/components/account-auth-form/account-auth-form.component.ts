import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { RequestStatus } from 'src/app/models/request-status.model';
import { validateToken } from 'src/app/state/actions/auth.actions';
import {
  selectAuthError,
  selectAuthLoading,
  selectIsAuthenticated,
} from 'src/app/state/selectors/auth.selectors';

@Component({
  selector: 'app-account-auth-form',
  templateUrl: './account-auth-form.component.html',
})
export class AccountAuthFormComponent {
  public authenticationForm: FormGroup = this.fb.group({
    token: ['', Validators.required],
  });

  tokenControl = this.authenticationForm.get('token') as FormControl;
  status: RequestStatus = 'init';

  isAuthenticated$: Observable<boolean>;
  authError$: Observable<string | null>;
  loading$: Observable<boolean>;

  constructor(
    private readonly fb: FormBuilder,
    private readonly store: Store,
    private readonly router: Router
  ) {
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
    this.authError$ = this.store.select(selectAuthError as any);
    this.loading$ = this.store.select(selectAuthLoading);

    this.authError$.subscribe((error) => {
      if (error) {
        this.authenticationForm
          .get('token')
          ?.setErrors({ tokenNotValid: true });
      }
    });
  }

  validateToken() {
    if (this.authenticationForm.invalid) {
      return;
    }

    const token = this.authenticationForm.value.token;

    this.store.dispatch(validateToken({ token }));
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
