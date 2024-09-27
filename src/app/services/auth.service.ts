import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseLogin } from '../models/auth.model';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { InitialSignUpData } from '../models/InitialSignUpData.interface';
import { TokenService } from './token.service';
import { checkToken } from '../interceptors/token.interceptor';
import { User, UserData } from '../models/user.model';

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

  private user: User | undefined;

  user$ = new BehaviorSubject<UserData | null>(null);

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  authToken(code: string) {
    const userId = this.user?.id ?? -1;
    const url = `${this.apiUrl}/auth/auth-account`;
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('code', code);

    console.log('userId: ', userId);

    return this.http.post(url, {}, { params });
  }

  getUserId() {
    return this.user?.id;
  }

  checkEmailAvailability(email: string): Observable<HttpResponse<boolean>> {
    const url = `${this.apiUrl}/auth/check-email-availability`;
    const params = new HttpParams().set('email', email);
    return this.http.get<boolean>(url, { observe: 'response', params });
  }

  createUser(formData: any) {
    return this.http
      .post<{ id: number }>(`${this.apiUrl}/auth/register`, formData)
      .pipe(
        tap((response: { id: number }) => {
          console.log('the id set is ' + response.id);

          this.user = { id: response.id } as User;
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
    const url = `${this.apiUrl}/auth/recover-password`;
    const params = new HttpParams().set('email', email);
    return this.http.post(url, {}, { params });
  }

  logout() {
    this.tokenService.removeToken();
  }

  changePassword(token: string, newPassword: string) {
    const url = `${this.apiUrl}/auth/change-password`;
    const body = { newPassword };
    const params = new HttpParams().set('token', token);
    return this.http.post(url, body, { params });
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
          this.user = user.data[0];

          console.log('User id: ', this.user.id);
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
