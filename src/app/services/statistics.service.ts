import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { TokenService } from './token.service';
import { Store } from '@ngrx/store';
import { selectUser } from '../state/selectors/users.selectors';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import {
  GeneralRanking,
  RankingInfo,
} from '../models/events/RankingInfo.model';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  private userId: number | undefined;
  private headers: HttpHeaders | undefined;
  private user!: User;

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

  getGeneralRanking(): Observable<GeneralRanking> {
    const url = `${environment.API_URL}/statistics/getGeneralRanking/${this.userId}`;
    return this.http.get<GeneralRanking>(url, {
      headers: this.setHeaders(),
    });
  }

  getClubRanking(clubId: number): Observable<GeneralRanking> {
    const url = `${environment.API_URL}/statistics/clubRanking/${clubId}`;
    const params = { userId: this.userId?.toString() ?? '' };
    return this.http.get<GeneralRanking>(url, {
      headers: this.setHeaders(),
      params,
    });
  }
}
