import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { AvailableSlotsResponse } from '../models/reservation.model';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { UserReservationResponse } from '../models/UserReservations.model';
import { ReservationConfirmation } from '../models/ReservationConfirmation.model';
import { Store } from '@ngrx/store';
import { selectUser } from '../state/selectors/users.selectors';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private token = this.tokenService.getToken();
  private userId: number | undefined;
  private headers = new HttpHeaders({
    Authorization: `Bearer ${this.token}`,
  });

  reservations$ = new BehaviorSubject<UserReservationResponse | null>(null);

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private authService: AuthService,
    private store: Store<any>
  ) {
    this.store.select(selectUser).subscribe((userId) => {
      this.userId = userId?.id;
    });
  }

  getAvailableSlotsPerDay(date: string) {
    const url = `${environment.API_URL}/reservation/club/1/available-date-times?date=${date}`;

    return this.http
      .get<AvailableSlotsResponse>(url, { headers: this.headers })
      .pipe(
        tap((response) => {
          console.log('Response:', response);
        })
      );
  }

  getUserReservations(): Observable<UserReservationResponse> {
    console.log('Token:', this.token);
    console.log('User ID:', this.userId);

    const url = `${environment.API_URL}/reservation/user/${this.userId}`;

    console.log('URL:', url);
    console.log('Headers:', this.headers);

    return this.http
      .get<UserReservationResponse>(url, { headers: this.headers })
      .pipe(
        tap((response) => {
          console.log('Response:', response);
          this.reservations$.next(response);
        })
      );
  }

  createReservation(selectedSlots: string[]) {
    const url = `${environment.API_URL}/reservation/${this.userId}`;

    const body = { appointmentTime: selectedSlots, clubId: 1 };

    return this.http.post<ReservationConfirmation>(url, body, {
      headers: this.headers,
    });
  }
}