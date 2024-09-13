import { Injectable } from '@angular/core';
import { getCookie, setCookie, removeCookie } from 'typescript-cookie';
import { jwtDecode, JwtPayload } from 'jwt-decode';

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
      console.log('Trying');

      const decodedToken = jwtDecode<JwtPayload>(token);

      if (decodedToken && decodedToken.exp) {
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
      console.log('Trying');

      const decodedToken = jwtDecode<JwtPayload>(token);

      if (decodedToken && decodedToken.exp) {
        console.log('decode token' + decodedToken);
        console.log('decde token date' + decodedToken.exp);

        const tokenDate = new Date(0);
        tokenDate.setUTCSeconds(decodedToken.exp);

        const today = new Date();

        console.log('ending is validRefreshToken');

        console.log(tokenDate.getTime() > today.getTime());

        return tokenDate.getTime() > today.getTime();
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }

    return false;
  }
}
