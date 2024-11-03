import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

export const redirectGuard: CanActivateFn = () => {
  console.log('redirectGuard');

  const isValidToken: string | unknown = inject(TokenService).isValidToken();
  if (isValidToken) {
    console.log('redirectGuard: valid token');
    inject(Router).navigate(['/home']);
  }
  return true;
};
