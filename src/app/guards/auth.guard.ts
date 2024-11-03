import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

export const AuthGuard: CanActivateFn = () => {
  console.log('AuthGuard');
  const isValidToken: boolean = inject(TokenService).isValidToken();
  const tokenService: TokenService = inject(TokenService);

  console.log('AuthGuard: isValidToken', isValidToken);

  if (!isValidToken) {
    console.log('AuthGuard: invalid token');

    tokenService.removeToken();
    console.log('AuthGuard: token removed');
    inject(Router).navigate(['/login']);
    return false;
  }
  return true;
};
