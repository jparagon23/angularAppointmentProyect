import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { Store } from '@ngrx/store';
import { selectUser } from '../state/selectors/users.selectors';
import { User } from '../models/user.model';
import { environment } from 'src/environments/environment';
import { ClubInfo } from '../models/ClubInfo.model';
import { MembershipDTO } from '../models/MembershipDTO.model';

@Injectable({
  providedIn: 'root',
})
export class ClubService {
  private userId: number | undefined;
  private headers: HttpHeaders | undefined;
  private user!: User;

  constructor(
    private readonly http: HttpClient,
    private readonly tokenService: TokenService,
    private readonly store: Store<any>
  ) {
    this.store.select(selectUser).subscribe((user) => {
      if (user) {
        this.userId = user?.id;
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

  subscribeToClub(clubId: number) {
    if (!this.userId) {
      throw new Error('User ID is not defined');
    }

    const url = `${environment.API_URL}/club/join`;
    const params = {
      userId: this.userId.toString(),
      clubId: clubId.toString(),
    };

    return this.http.post(url, null, {
      headers: this.setHeaders(),
      params,
    });
  }

  unsubscribeToClub(clubId: number, userId?: number) {
    if (!this.userId) {
      throw new Error('User ID is not defined');
    }

    userId = userId ?? this.userId;

    const url = `${environment.API_URL}/club/cancel`;
    const params = {
      userId: userId.toString(),
      clubId: clubId.toString(),
    };

    return this.http.post(url, null, {
      headers: this.setHeaders(),
      params,
    });
  }

  getActiveClubs(): Observable<ClubInfo[]> {
    const url = `${environment.API_URL}/active-clubs`;
    return this.http.get<ClubInfo[]>(url, {
      headers: this.setHeaders(),
    });
  }

  getClubById(clubId: number): Observable<ClubInfo> {
    const url = `${environment.API_URL}/club-info/${clubId}`;
    return this.http.get<ClubInfo>(url, {
      headers: this.setHeaders(),
    });
  }

  membershipAction(
    clubId: number,
    userId: number,
    action: 'approve' | 'reject'
  ) {
    const url = `${environment.API_URL}/club/${action}`;
    const params = {
      userId: userId.toString(),
      clubId: clubId.toString(),
    };
    return this.http.post(url, null, {
      headers: this.setHeaders(),
      params,
    });
  }

  getPendingMembershipRequests(): Observable<MembershipDTO[]> {
    const clubId = this.user.userAdminClub;
    const url = `${environment.API_URL}/club/${clubId}/pendingMembershipRequests`;
    return this.http.get<MembershipDTO[]>(url, {
      headers: this.setHeaders(),
    });
  }

  getAllActiveClubMembers(clubId: number): Observable<MembershipDTO[]> {
    const url = `${environment.API_URL}/club/${clubId}/active-members`;
    return this.http.get<MembershipDTO[]>(url, {
      headers: this.setHeaders(),
    });
  }
}
