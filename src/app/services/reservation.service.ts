import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { AvailableSlotsResponse } from '../models/reservation.model';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import {
  ReservationDetail,
  UserReservationResponse,
} from '../models/UserReservations.model';
import { ReservationConfirmation } from '../models/ReservationConfirmation.model';
import { Store } from '@ngrx/store';
import { selectUser } from '../state/selectors/users.selectors';
import { ClubReservations } from '../models/ClubReservations.model';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private userId: number | undefined;
  private headers: HttpHeaders | undefined;

  reservations$ = new BehaviorSubject<UserReservationResponse | null>(null);

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private authService: AuthService,
    private store: Store<any>
  ) {
    // Subscribe to userId once, avoid multiple subscriptions
    this.store.select(selectUser).subscribe((user) => {
      this.userId = user?.id;
    });
  }

  private setHeaders(): HttpHeaders {
    console.log('setting headers');

    this.headers = new HttpHeaders({
      Authorization: `Bearer ${this.tokenService.getToken()}`,
    });

    return this.headers;
  }

  getAvailableSlotsPerDay(date: string): Observable<AvailableSlotsResponse> {
    const url = `${environment.API_URL}/reservation/club/1/available-date-times?date=${date}`;
    return this.http
      .get<AvailableSlotsResponse>(url, { headers: this.setHeaders() })
      .pipe(tap((response) => console.log('Response:', response)));
  }

  getUserReservations(): Observable<UserReservationResponse> {
    const url = `${environment.API_URL}/reservation/user/${this.userId}`;
    console.log('Fetching reservations for User ID:', this.userId);

    return this.http
      .get<UserReservationResponse>(url, { headers: this.setHeaders() })
      .pipe(
        tap((response) => {
          console.log('User Reservations Response:', response);
          this.reservations$.next(response);
        })
      );
  }

  getClubReservations(
    date: string,
    club: number
  ): Observable<ClubReservations> {
    const url = `${environment.API_URL}/reservation/club/${club}/reservations?date=${date}`;
    return this.http.get<ClubReservations>(url, { headers: this.setHeaders() });
  }

  createReservation(
    selectedSlots: string[]
  ): Observable<ReservationConfirmation> {
    const url = `${environment.API_URL}/reservation/${this.userId}`;
    const body = { appointmentTime: selectedSlots, clubId: 1 };

    return this.http.post<ReservationConfirmation>(url, body, {
      headers: this.setHeaders(),
    });
  }

  cancelReservation(
    reservationId: String
  ): Observable<ReservationConfirmation> {
    const url = `${environment.API_URL}/reservation/${reservationId}`;
    return this.http.delete<ReservationConfirmation>(url, {
      headers: this.setHeaders(),
    });
  }
}
