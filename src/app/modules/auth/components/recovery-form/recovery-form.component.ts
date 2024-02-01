import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestStatus } from 'src/app/models/request-status.model';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import { AuthService } from 'src/app/services/auth.service';
import { CustomValidators } from 'src/app/utils/validators';

@Component({
  selector: 'app-recovery-form',
  templateUrl: './recovery-form.component.html',
})
export class RecoveryFormComponent {
  form = this.formBuilder.group(
    {
      newPassword: ['', [Validators.minLength(6), Validators.required]],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: [
        CustomValidators.MatchValidator('newPassword', 'confirmPassword'),
      ],
    }
  );
  status: RequestStatus = 'init';
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  showPassword = false;
  token = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.queryParamMap.subscribe((params) => {
      const token = params.get('token');
      if (token) {
        this.token = token;
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  recovery() {
    if (this.form.valid) {
      this.status = 'loading';
      const { newPassword } = this.form.getRawValue();

      // Verifica que newPassword no sea null antes de llamar al servicio
      if (newPassword) {
        this.authService.changePassword(this.token, newPassword).subscribe({
          next: () => {
            this.status = 'success';
            this.router.navigate(['/login']);
          },
          error: () => {
            this.status = 'failed';
          },
        });
      } else {
        // Handle the case where newPassword is null (optional)
        console.error('New password is null');
      }
    } else {
      this.form.markAllAsTouched();
    }
  }
}
