import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseLogin } from '../models/auth.model';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl = environment.API_URL;

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http
      .post<ResponseLogin>(`${this.apiUrl}/api/v1/auth/login`, {
        email,
        password,
      })
      .pipe(
        tap((response) => {
          // this.tokenService.saveToken(response.access_token);
          // this.tokenService.saveRefreshToken(response.refresh_token);
          console.log(response);
        })
      );
  }
}
