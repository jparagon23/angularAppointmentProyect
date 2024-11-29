import { LightUser } from 'src/app/models/LightUser.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { UserReservationResponse } from '../models/UserReservations.model';
import { ReservationConfirmation } from '../models/ReservationConfirmation.model';
import { Store } from '@ngrx/store';
import { selectUser } from '../state/selectors/users.selectors';
import { ClubReservations } from '../models/ClubReservations.model';
import { GroupReservationInfo } from '../models/GroupReservationInfo.model';
import { User } from '../models/user.model';
import { ClubAvailability } from '../models/ClubAvalability.model';
import { AvailableSlotsResponse } from '../models/AvailableSlotInfo.model';
import { CancellationCause } from '../models/CancellationCause.model';
import { CancellationClubCauses } from '../models/CancellationClubCauses.model';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private userId: number | undefined;
  private headers: HttpHeaders | undefined;
  private user!: User;

  reservations$ = new BehaviorSubject<UserReservationResponse | null>(null);

  constructor(
    private readonly http: HttpClient,
    private readonly tokenService: TokenService,
    private readonly store: Store<any>
  ) {
    // Subscribe to userId once, avoid multiple subscriptions
    this.store.select(selectUser).subscribe((user) => {
      this.userId = user?.id;
    });

    this.store.select(selectUser).subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });
  }

  private setHeaders(): HttpHeaders {
    this.headers = new HttpHeaders({
      Authorization: `Bearer ${this.tokenService.getToken()}`,
    });

    return this.headers;
  }

  getAvailableSlotsPerDay(date: string): Observable<AvailableSlotsResponse> {
    const url = `${environment.API_URL}/reservation/club/1/available-date-times?date=${date}`;
    return this.http.get<AvailableSlotsResponse>(url, {
      headers: this.setHeaders(),
    });
  }

  getUserReservations(): Observable<UserReservationResponse> {
    const url = `${environment.API_URL}/reservation/user/${this.userId}`;

    return this.http
      .get<UserReservationResponse>(url, { headers: this.setHeaders() })
      .pipe(
        tap((response) => {
          this.reservations$.next(response);
        })
      );
  }

  getReservationsByGroupId(groupId: string): Observable<GroupReservationInfo> {
    const url = `${environment.API_URL}/reservation/group-reservation/${groupId}`;
    return this.http.get<GroupReservationInfo>(url, {
      headers: this.setHeaders(),
    });
  }

  getClubReservations(date: string): Observable<ClubReservations> {
    const url = `${environment.API_URL}/reservation/club/${this.user.userAdminClub}/reservations?date=${date}`;
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

  createReservationAdmin(
    selectedSlots: string[],
    userId: string,
    lightUser: LightUser | null,
    court: string | null
  ): Observable<ReservationConfirmation> {
    const url = `${environment.API_URL}/reservation/${userId}`;
    const body = {
      appointmentTime: selectedSlots,
      clubId: 1,
      lightUser: lightUser,
      courtId: court,
    };

    console.log(body);

    return this.http.post<ReservationConfirmation>(url, body, {
      headers: this.setHeaders(),
    });
  }

  cancelReservation(
    reservationId: string,
    cause: CancellationCause | null
  ): Observable<ReservationConfirmation> {
    const url = `${environment.API_URL}/reservation/${reservationId}`;
    const body = cause;

    return this.http.delete<ReservationConfirmation>(url, {
      headers: this.setHeaders(),
      body: body,
    });
  }

  getReservationConfiguration(): Observable<ClubAvailability> {
    const url = `${environment.API_URL}/configuration/club/${this.user.userAdminClub}/availability`;
    return this.http.get<ClubAvailability>(url, { headers: this.setHeaders() });
  }

  getCancellationCauses(): Observable<CancellationClubCauses[]> {
    const url = `${environment.API_URL}/configuration/club/${this.user.userAdminClub}/cancellation-causes`;
    return this.http.get<CancellationClubCauses[]>(url, {
      headers: this.setHeaders(),
    });
  }

  deleteCancellationCause(causeId: string): Observable<void> {
    const url = `${environment.API_URL}/configuration/club/${this.user.userAdminClub}/cancellation-causes/${causeId}`;
    return this.http.delete<void>(url, { headers: this.setHeaders() });
  }

  createCancellationCause(
    description: string
  ): Observable<CancellationClubCauses> {
    const url = `${environment.API_URL}/configuration/club/${this.user.userAdminClub}/cancellation-causes`;
    const body = { description };
    return this.http.post<CancellationClubCauses>(url, body, {
      headers: this.setHeaders(),
    });
  }

  updateCancellationCause(
    causeId: string,
    description: string
  ): Observable<CancellationClubCauses> {
    const url = `${environment.API_URL}/configuration/club/${this.user.userAdminClub}/cancellation-causes/${causeId}`;
    const body = { description };
    return this.http.put<CancellationClubCauses>(url, body, {
      headers: this.setHeaders(),
    });
  }
}
