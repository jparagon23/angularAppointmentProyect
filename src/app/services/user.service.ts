import { authGuard } from './../guards/auth.guard';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserReservationResponse } from '../models/UserReservations.model';
import { TokenService } from './token.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private authService: AuthService
  ) {}

  reservations$ = new BehaviorSubject<UserReservationResponse | null>(null);

  getUserReservations(): Observable<UserReservationResponse> {
    const token = this.tokenService.getToken();
    const userId = this.authService.getUserId();

    console.log('Token:', token);
    console.log('User ID:', userId);

    const url = `${environment.API_URL}/reservation/user/${userId}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    console.log('URL:', url);
    console.log('Headers:', headers);

    return this.http.get<UserReservationResponse>(url, { headers }).pipe(
      tap((response) => {
        console.log('Response:', response);
        this.reservations$.next(response);
      })
    );
  }
}
