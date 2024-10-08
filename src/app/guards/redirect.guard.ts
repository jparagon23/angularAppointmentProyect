import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { TokenService } from "../services/token.service";

export const redirectGuard: CanActivateFn = () => {
  console.log("soy el redirect");
  
  const tokenService = inject(TokenService);
  const router = inject(Router);

  const isValidToken = tokenService.isValidToken();
  const role = tokenService.getUserFromToken(); // Obtener el rol desde el token

  console.log("role", role);


  if (isValidToken && role) {
    if (role === 'ROLE_CLUB_ADMIN') { // Verifica si el rol es admin
      router.navigate(['/home/admin']);
    } else {
      router.navigate(['/home']);
    }
    return false; // Prevenir que la ruta actual se active
  }

  return true; // Permitir la navegación si no hay token o no es válido
};
