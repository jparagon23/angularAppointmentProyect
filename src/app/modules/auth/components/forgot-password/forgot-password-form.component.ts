import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot-password-form',
  templateUrl: './forgot-password-form.component.html',
})
export class ForgotPasswordFormComponent {
  form = this.formBuilder.group({
    email: ['', [Validators.email, Validators.required]],
  });
  status: string = 'init';
  emailSent = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {}

  sendLink() {
    if (this.form.valid) {
      this.status = 'loading';
      const { email } = this.form.getRawValue();

      if (email) {
        this.authService.recovery(email).subscribe({
          next: () => {
            this.status = 'success';
            this.emailSent = true;
          },
          error: () => {
            this.status = 'failed';
          },
        });
      } else {
        console.error('Email is null');
      }
    } else {
      this.form.markAllAsTouched();
    }
  }
}
