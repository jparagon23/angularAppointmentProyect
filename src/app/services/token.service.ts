import { Injectable } from '@angular/core';
import { getCookie, setCookie, removeCookie } from 'typescript-cookie';
import { jwtDecode, JwtPayload } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor() {}

  saveToken(token: string) {
    setCookie('token-tennapp', token, { expires: 365, path: '/' });
    console.log('Token saved', token);
  }

  getToken() {
    const token = getCookie('token-tennapp');

    return token;
  }

  getUserId(): number | null {
    const userIdCookie = getCookie('user-id-tennapp');
    return userIdCookie ? parseInt(userIdCookie, 10) : null;
  }

  removeToken() {
    removeCookie('token-tennapp');
    removeCookie('refresh-token-tennapp');
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
    setCookie('refresh-token-tennapp', token, { expires: 365, path: '/' });
    console.log('Refresh token saved', token);
  }

  getRefreshToken() {
    const token = getCookie('refresh-token-tennapp');
    return token;
  }
  removeRefreshToken() {
    removeCookie('refresh-token-tennapp');
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
