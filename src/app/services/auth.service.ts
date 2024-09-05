import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseLogin } from '../models/auth.model';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { InitialSignUpData } from '../models/InitialSignUpData.interface';
import { TokenService } from './token.service';
import { checkToken } from '../interceptors/token.interceptor';
import { UserData } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private initialSignUpData: InitialSignUpData = {
    documentTypes: [],
    genders: [],
    phoneTypes: [],
    categories: [],
  };

  apiUrl = environment.API_URL;

  private initialSignUpDataLoaded = false;

  private userId: number | undefined;

  user$ = new BehaviorSubject<UserData | null>(null);

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  authToken(code: any) {
    if (this.userId === undefined) {
      this.userId = -1;
    }

    const url = `${this.apiUrl}/auth/auth-account?userId=${this.userId}&code=${code}`;
    return this.http.post(url, {});
  }

  getUserId() {
    return this.userId;
  }

  checkEmailAvailability(email: string): Observable<HttpResponse<boolean>> {
    const url = `${this.apiUrl}/auth/check-email-availability?email=${email}`;
    return this.http.get<boolean>(url, { observe: 'response' });
  }

  createUser(formData: any) {
    return this.http.post(`${this.apiUrl}/auth/register`, formData).pipe(
      tap((response: any) => {
        this.userId = response.id;
      })
    );
  }

  login(formData: { email: string; password: string }) {
    const body = JSON.stringify(formData);
    return this.http.post<ResponseLogin>(`${this.apiUrl}/login`, body).pipe(
      tap((response) => {
        this.tokenService.saveToken(response.access_token);
        this.tokenService.saveRefreshToken(response.refresh_token);
      })
    );
  }

  getInitialSignUpData(): Observable<InitialSignUpData> {
    console.log('Entering getInitialSignUpData');
    console.log('Data Loaded:', this.initialSignUpDataLoaded);

    if (this.initialSignUpDataLoaded) {
      console.log('Returning cached data');
      return new Observable((observer) => {
        observer.next(this.initialSignUpData);
        observer.complete();
      });
    }

    console.log('Making HTTP request');

    return this.http
      .get<InitialSignUpData>(`${this.apiUrl}/auth/initial-sign-up-data`)
      .pipe(
        tap((data) => {
          console.log('Data loaded successfully');
          this.initialSignUpData = data;
          this.initialSignUpDataLoaded = true;
          console.log(this.initialSignUpDataLoaded);
        })
      );
  }

  recovery(email: string) {
    return this.http.post(`${this.apiUrl}/auth/recover-password`, {
      email,
    });
  }

  logout() {
    this.tokenService.removeToken();
  }

  changePassword(token: string, newPassword: string) {
    return this.http.post(`${this.apiUrl}/auth/change-password`, {
      token,
      newPassword,
    });
  }

  getProfile() {
    const token = this.tokenService.getToken();
    return this.http
      .get<UserData>(`${this.apiUrl}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .pipe(
        tap((user) => {
          this.user$.next(user);
        })
      );
  }

  refreshToken(refreshToken: string) {
    return this.http
      .post<ResponseLogin>(`${this.apiUrl}/api/v1/auth/refresh-token`, {
        refreshToken,
      })
      .pipe(
        tap((response) => {
          this.tokenService.saveToken(response.access_token);
          this.tokenService.saveRefreshToken(response.refresh_token);
        })
      );
  }
}
