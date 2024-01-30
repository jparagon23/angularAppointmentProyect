import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { RequestStatus } from 'src/app/models/request-status.model';
import { AuthService } from 'src/app/services/auth.service';

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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  validateToken() {
    if (this.authenticationForm.invalid) {
      return;
    }

    this.authService.authToken(this.authenticationForm.value.token).subscribe({
      next: (response) => {
        console.log(response);
        this.router.navigate(['/anotherPage']);
      },
      error: (error) => {
        if (error instanceof HttpErrorResponse && error.status === 400) {
          const validationError = error.error;
          console.log(validationError);

          if (validationError.errorCode === 'ValidationError') {
            // Set an error for the 'token' form control
            this.authenticationForm
              .get('token')
              ?.setErrors({ tokenNotValid: true });
          }
        }
      },
    });
  }
}
