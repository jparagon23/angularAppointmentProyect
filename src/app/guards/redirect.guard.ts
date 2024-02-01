import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

export const redirectGuard: CanActivateFn = () => {
  console.log('guard 1');

  const isValidToken: string | unknown =
    inject(TokenService).isValidRefreshToken();
  if (isValidToken) {
    inject(Router).navigate(['/app']);
  }
  return true;
};
