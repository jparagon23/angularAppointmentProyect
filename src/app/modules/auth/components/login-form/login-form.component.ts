import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  faPen,
  faEye,
  faEyeSlash,
  faLock,
} from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { RequestStatus } from 'src/app/models/request-status.model';
import { AuthService } from 'src/app/services/auth.service';
import { login } from 'src/app/state/actions/auth.actions';
import { AppState } from 'src/app/state/app.state';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
})
export class LoginFormComponent implements OnInit {
  faPen = faPen;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  showPassword = false;
  status$: Observable<RequestStatus>;
  faLock = faLock;

  invalidCredentials: boolean = false;

  loginForm = this.formBuilder.group({
    email: [
      localStorage.getItem('email') || '',
      [Validators.required, Validators.email],
    ],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>
  ) {
    this.status$ = this.store.select((state) =>
      state.auth.loading ? 'loading' : state.auth.error ? 'failed' : 'init'
    );
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      const emailParam = params.get('email');
      if (emailParam !== null) {
        this.loginForm.controls.email.setValue(emailParam);
      }
    });

    this.store
      .select((state) => state.auth.error)
      .subscribe((error) => {
        if (error) {
          this.invalidCredentials = true;
        }
      });
  }

  doLogin() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      if (email && password) {
        this.store.dispatch(login({ email, password }));
      } else {
        console.error('Email o contraseña no válidos');
      }
    }
  }
}
