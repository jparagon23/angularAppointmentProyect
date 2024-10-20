import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseLogin } from '../models/auth.model';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { InitialSignUpData } from '../models/InitialSignUpData.interface';
import { TokenService } from './token.service';
import { User, UserData } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  validateToken(arg0: { token: any }): any {
    throw new Error('Method not implemented.');
  }
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

  constructor(
    private readonly http: HttpClient,
    private readonly tokenService: TokenService
  ) {}

  authToken(code: string) {
    const userId = this.user?.id ?? -1;
    const url = `${this.apiUrl}/auth/auth-account`;
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('code', code);

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
          this.user = { id: response.id } as User;
        })
      );
  }

  login(formData: {
    email: string;
    password: string;
  }): Observable<ResponseLogin> {
    console.log('logging in');

    const body = JSON.stringify(formData);
    return this.http.post<ResponseLogin>(`${this.apiUrl}/login`, body).pipe(
      tap((response) => {
        if (response.access_token && response.refresh_token) {
          this.tokenService.saveToken(response.access_token);
          this.tokenService.saveRefreshToken(response.refresh_token);
        } else if (response.userId) {
          console.log('setting the userId' + response.userId);

          this.user = { id: response.userId } as unknown as User;
        }
        console.log('didnt do anything');
      })
    );
  }

  getInitialSignUpData(): Observable<InitialSignUpData> {
    if (this.initialSignUpDataLoaded) {
      return new Observable((observer) => {
        observer.next(this.initialSignUpData);
        observer.complete();
      });
    }

    return this.http
      .get<InitialSignUpData>(`${this.apiUrl}/auth/initial-sign-up-data`)
      .pipe(
        tap((data) => {
          this.initialSignUpData = data;
          this.initialSignUpDataLoaded = true;
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
          if (response.access_token && response.refresh_token) {
            this.tokenService.saveToken(response.access_token);
            this.tokenService.saveRefreshToken(response.refresh_token);
          }
        })
      );
  }

  resendAuthenticationCode() {
    const userId = this.user?.id ?? -1;
    const url = `${this.apiUrl}/auth/resend-auth-code`;
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.post(url, {}, { params });
  }

  setUserId(userId: string) {
    this.user = { id: userId } as unknown as User;
  }
}
