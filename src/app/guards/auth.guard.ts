import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

export const AuthGuard: CanActivateFn = () => {
  console.log('AuthGuard');
  const isValidToken: boolean = inject(TokenService).isValidToken();
  const tokenService: TokenService = inject(TokenService);

  if (!isValidToken) {
    tokenService.removeToken();
    inject(Router).navigate(['/login']);
    return false;
  }
  return true;
};
