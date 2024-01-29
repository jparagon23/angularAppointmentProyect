import { Component } from '@angular/core';
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
  loginForm = this.formBuilder.nonNullable.group({
    email: [
      localStorage.getItem('email') || '',
      [Validators.required, Validators.email],
    ],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  faPen = faPen;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  showPassword = false;
  status: RequestStatus = 'init';
  faLock = faLock;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.route.queryParamMap.subscribe((params) => {
      const email = params.get('email');
      if (email) {
        this.loginForm.controls.email.setValue(email);
      }
    });
  }

  shouldApplyRedBorder(controlName: string): boolean {
    const control = this.loginForm.get(controlName)!; // Non-null assertion
    return (control.touched || control.dirty) && control.invalid;
  }

  shouldShowError(controlName: string): boolean {
    const control = this.loginForm.get(controlName)!; // Non-null assertion
    return control.touched && control.invalid;
  }

  hasError(controlName: string, errorType: string): boolean {
    const control = this.loginForm.get(controlName)!; // Non-null assertion
    return control.hasError(errorType);
  }

  doLogin() {
    if (this.loginForm.valid) {
      this.status = 'loading';
      const { email, password } = this.loginForm.getRawValue();
      this.authService.login(email, password).subscribe({
        next: () => {
          this.status = 'success';
          this.router.navigate(['/app']);
        },
        error: () => {
          this.status = 'failed';
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
