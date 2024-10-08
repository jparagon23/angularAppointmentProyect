import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  faPen,
  faEye,
  faEyeSlash,
  faLock,
} from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { login } from 'src/app/state/actions/auth.actions';
import { AppState } from 'src/app/state/app.state';
import {
  selectAuthLoading,
  selectAuthError,
} from 'src/app/state/selectors/auth.selectors';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
})
export class LoginFormComponent implements OnInit {
  faPen = faPen;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  faLock = faLock;

  showPassword = false;
  loadingLogin$: Observable<boolean>;
  invalidCredentials$: Observable<boolean>;

  loginForm = this.formBuilder.group({
    email: [
      localStorage.getItem('email') ?? '',
      [Validators.required, Validators.email],
    ],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly store: Store<AppState>
  ) {
    // Use selector for loading state
    this.loadingLogin$ = this.store.select(selectAuthLoading);
    // Use selector for error state and map it to check if the error is due to invalid credentials
    this.invalidCredentials$ = this.store.select(selectAuthError);
  }

  ngOnInit() {
    // Check for email in query parameters and pre-fill the form
    this.route.queryParamMap.subscribe((params) => {
      const emailParam = params.get('email');
      if (emailParam !== null) {
        this.loginForm.controls.email.setValue(emailParam);
      }
    });
  }

  // Dispatch the login action if the form is valid
  doLogin() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.store.dispatch(login({ email: email!, password: password! }));
    }
  }
}
