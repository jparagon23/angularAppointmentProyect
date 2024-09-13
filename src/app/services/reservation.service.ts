import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { AvailableSlotsResponse } from '../models/reservation.model';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private authService: AuthService
  ) {}

  getAvailableSlotsPerDay(date: string) {
    const token = this.tokenService.getToken();

    const url = `${environment.API_URL}/reservation/club/1/available-date-times?date=${date}`;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<AvailableSlotsResponse>(url, { headers }).pipe(
      tap((response) => {
        console.log('Response:', response);
      })
    );
  }
}
