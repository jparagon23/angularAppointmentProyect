import { Injectable } from '@angular/core';
import { getCookie, setCookie, removeCookie } from 'typescript-cookie';
import { jwtDecode, JwtPayload } from 'jwt-decode';

interface DecodedToken extends JwtPayload {
  roles: string; // O ajusta el tipo según sea necesario (puede ser un array si es necesario)
  userId: string; // Incluye cualquier otra propiedad que necesites
}

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor() {}

  saveToken(token: string) {
    setCookie('token-appnet', token, { expires: 365, path: '/' });
  }

  getToken() {
    const token = getCookie('token-appnet');

    return token;
  }

  getUserId(): number | null {
    const userIdCookie = getCookie('user-id-appnet');
    return userIdCookie ? parseInt(userIdCookie, 10) : null;
  }

  removeToken() {
    removeCookie('token-appnet');
    removeCookie('refresh-token-appnet');
  }

  isValidToken(): boolean {
    const token = this.getToken();

    if (!token) {
      return false;
    }

    try {
      const decodedToken = jwtDecode<JwtPayload>(token);

      if (decodedToken?.exp) {
        const tokenDate = new Date(0);
        tokenDate.setUTCSeconds(decodedToken.exp);

        const today = new Date();
        return tokenDate.getTime() > today.getTime();
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }

    return false;
  }

  saveRefreshToken(token: string) {
    setCookie('refresh-token-appnet', token, { expires: 365, path: '/' });
  }

  getRefreshToken() {
    const token = getCookie('refresh-token-appnet');
    return token;
  }
  removeRefreshToken() {
    removeCookie('refresh-token-appnet');
  }

  isValidRefreshToken(): boolean {
    const token = this.getRefreshToken();

    if (!token) {
      return false;
    }

    try {
      const decodedToken = jwtDecode<JwtPayload>(token);

      if (decodedToken?.exp) {
        const tokenDate = new Date(0);
        tokenDate.setUTCSeconds(decodedToken.exp);

        const today = new Date();

        return tokenDate.getTime() > today.getTime();
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }

    return false;
  }


  getUserFromToken() {
    const token = this.getToken(); // O donde guardes el token
    if (token) {
      try {
        // Decodificar el token usando jwtDecode
        const decodedToken = jwtDecode<DecodedToken>(token);
  
        console.log("Token decoded:", decodedToken);

        console.log(decodedToken);
        

        console.log("el rol es " + decodedToken.roles);
        
        
        // Retornar el rol del usuario
        return decodedToken?.roles || null; // Retorna el rol como cadena
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  }

}
