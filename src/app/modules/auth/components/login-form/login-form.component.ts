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
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false],
  });

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly store: Store<AppState>
  ) {
    this.loadingLogin$ = this.store.select(selectAuthLoading);
    this.invalidCredentials$ = this.store.select(selectAuthError);
  }

  ngOnInit() {
    // Pre-fill email if found in localStorage
    const savedEmail = localStorage.getItem('forehAppEmail');
    if (savedEmail) {
      this.loginForm.controls.email.setValue(savedEmail);
      this.loginForm.controls.rememberMe.setValue(true);
    }

    // Also check for email in query parameters and override if present
    this.route.queryParamMap.subscribe((params) => {
      const emailParam = params.get('email');
      if (emailParam !== null) {
        this.loginForm.controls.email.setValue(emailParam);
      }
    });
  }

  doLogin() {
    if (this.loginForm.valid) {
      const { email, password, rememberMe } = this.loginForm.value;

      if (rememberMe) {
        localStorage.setItem('forehAppEmail', email!);
      } else {
        localStorage.removeItem('forehAppEmail');
      }
      this.store.dispatch(login({ email: email!, password: password! }));
    }
  }
}
