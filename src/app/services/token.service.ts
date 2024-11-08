import { Injectable } from '@angular/core';
import { getCookie, setCookie, removeCookie } from 'typescript-cookie';
import { jwtDecode, JwtPayload } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor() {}

  saveToken(token: string) {
    setCookie('token-forehapp', token, { expires: 365, path: '/' });
  }

  getToken() {
    const token = getCookie('token-forehapp');

    return token;
  }

  getUserId(): number | null {
    const userIdCookie = getCookie('user-id-forehapp');
    return userIdCookie ? parseInt(userIdCookie, 10) : null;
  }

  removeToken() {
    removeCookie('token-forehapp');
    removeCookie('refresh-token-forehapp');
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
    setCookie('refresh-token-forehapp', token, { expires: 365, path: '/' });
  }

  getRefreshToken() {
    const token = getCookie('refresh-token-forehapp');
    return token;
  }
  removeRefreshToken() {
    removeCookie('refresh-token-forehapp');
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
}
