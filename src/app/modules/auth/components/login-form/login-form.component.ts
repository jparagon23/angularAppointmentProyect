import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  faPen,
  faEye,
  faEyeSlash,
  faLock,
} from '@fortawesome/free-solid-svg-icons';
import { RequestStatus } from 'src/app/models/request-status.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
})
export class LoginFormComponent {
  faPen = faPen;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  showPassword = false;
  status: RequestStatus = 'init';
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
    private authService: AuthService
  ) {
    this.route.queryParamMap.subscribe((params) => {
      const emailParam = params.get('email');
      if (emailParam !== null) {
        this.loginForm.controls.email.setValue(emailParam);
      }
    });
  }

  doLogin() {
    if (this.loginForm.valid) {
      this.status = 'loading';
      const { email, password } = this.loginForm.value;

      if (
        email !== null &&
        email !== undefined &&
        password !== null &&
        password !== undefined
      ) {
        this.authService.login({ email, password }).subscribe({
          next: () => {
            this.status = 'success';
            this.router.navigate(['/home']);
          },
          error: (error) => {
            this.status = 'failed';
            if (error.status === 401) {
              this.invalidCredentials = true;
              this.loginForm.reset();
            }
          },
        });
      } else {
        console.error('Email o contraseña no válidos');
      }
    }
  }
}
