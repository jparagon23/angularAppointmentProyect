import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';
import { Store } from '@ngrx/store';
import { catchError, filter, map, of, tap } from 'rxjs';
import { selectUser } from '../state/selectors/users.selectors';

export const AuthGuard: CanActivateFn = () => {
  const isValidToken: boolean = inject(TokenService).isValidToken();

  if (!isValidToken) {
    inject(Router).navigate(['/login']);
    return false;
  }
  return true;
};
