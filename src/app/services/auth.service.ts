import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseLogin } from '../models/auth.model';
import { environment } from 'src/environments/environment';
import { Observable, tap } from 'rxjs';
import { InitialSignUpData } from '../models/InitialSignUpData.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private initialSignUpData: InitialSignUpData = {
    documentTypes: [],
    genders: [],
    phoneTypes: [],
  };

  apiUrl = environment.API_URL;

  private initialSignUpDataLoaded = false;

  private userId: number | undefined;

  constructor(private http: HttpClient) {}

  authToken(code: any) {
    if (this.userId === undefined) {
      this.userId = -1;
    }

    const url = `${this.apiUrl}/auth/authAccount?userId=${this.userId}&code=${code}`;
    return this.http.post(url, {}); // Se pasa un objeto vacío como cuerpo, ajusta según tus necesidades
  }

  getUserId() {
    return this.userId;
  }

  checkEmailAvailability(email: string): Observable<HttpResponse<boolean>> {
    const url = `${this.apiUrl}/auth/checkEmailAvailability?email=${email}`;
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
        console.log('holi');
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
      .get<InitialSignUpData>(`${this.apiUrl}/auth/initialSignUpData`)
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

  changePassword(token: string, newPassword: string) {
    return this.http.post(`${this.apiUrl}/auth/change-password`, {
      token,
      newPassword,
    });
  }
}
