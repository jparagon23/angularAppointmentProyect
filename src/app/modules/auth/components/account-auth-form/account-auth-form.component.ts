import { HttpErrorResponse } from '@angular/common/http';
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
import { AuthService } from 'src/app/services/auth.service';
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
    private fb: FormBuilder,
    private store: Store,
    private router: Router
  ) {
    // Seleccionar estados desde el store
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
    this.authError$ = this.store.select(selectAuthError);
    this.loading$ = this.store.select(selectAuthLoading);

    // Manejo de errores de autenticación
    this.authError$.subscribe((error) => {
      if (error) {
        // Aquí puedes establecer un error en el formulario
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

    // Despachar la acción para validar el token
    this.store.dispatch(validateToken({ token }));
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
