import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';
import { Store } from '@ngrx/store';
import { selectUser } from '../state/selectors/users.selectors';
import { MatchResultDto } from '../models/PostResult.model';
import { environment } from 'src/environments/environment';
import { UserMatch, UserMatchResponse } from '../models/events/UserMatch.model';

@Injectable({
  providedIn: 'root',
})
export class MatchService {
  private userId: number | undefined;
  private headers: HttpHeaders | undefined;
  private user!: User;

  private readonly cachedMatches: UserMatch[] | null = null; // Cache variable

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

  publishMatchResult(matchResult: MatchResultDto) {
    const url = `${environment.API_URL}/match`;
    return this.http.post(url, matchResult, {
      headers: this.setHeaders(),
    });
  }

  getUserMatches(
    userId?: number,
    matchType: string = 'SINGLES',
    status?: string | null, // Opcional
    page: number = 0,
    size: number = 10,
    sortBy: string = 'match_date',
    sortDir: string = 'desc'
  ): Observable<UserMatchResponse> {
    const id = userId ?? this.userId;

    if (id === undefined) {
      throw new Error('User ID is not defined');
    }

    let params = new HttpParams()
      .set('matchType', matchType.toString())
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    if (status) {
      // Solo agregar si tiene valor
      params = params.set('matchStatus', status);
    }

    const url = `${environment.API_URL}/match/user/${id}`;
    return this.http.get<any>(url, {
      headers: this.setHeaders(),
      params,
    });
  }

  getClubMatches(
    clubId?: number,
    matchType: string = 'SINGLES',
    status?: string | null, // Opcional
    page: number = 0,
    size: number = 10,
    sortBy: string = 'match_date',
    sortDir: string = 'desc'
  ): Observable<UserMatchResponse> {
    if (clubId === undefined) {
      throw new Error('User ID is not defined');
    }

    let params = new HttpParams()
      .set('matchType', matchType.toString())
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    if (status) {
      // Solo agregar si tiene valor
      params = params.set('matchStatus', status);
    }

    const url = `${environment.API_URL}/match/club/${clubId}`;
    return this.http.get<any>(url, {
      headers: this.setHeaders(),
      params,
    });
  }

  matchConfirmationAction(matchId: number, action: string) {
    const url = `${environment.API_URL}/match/${matchId}/${action}`;
    return this.http.patch(
      url,
      {},
      {
        headers: this.setHeaders(),
      }
    );
  }

  deleteMatchResult(matchId: number) {
    const url = `${environment.API_URL}/match/${matchId}`;
    return this.http.delete(url, {
      headers: this.setHeaders(),
    });
  }

  getMatchById(matchId: number): Observable<UserMatch> {
    const url = `${environment.API_URL}/match/${matchId}`;
    return this.http.get<UserMatch>(url, {
      headers: this.setHeaders(),
    });
  }

  getUserMatchesStats(matchType: string, userId?: number): Observable<any> {
    const id = userId ?? this.userId;
    const url = `${environment.API_URL}/match/statistics/${id}/${matchType}`;
    return this.http.get<any>(url, {
      headers: this.setHeaders(),
    });
  }

  getAdminPostedMatches(): Observable<UserMatch[]> {
    const url = `${environment.API_URL}/match/postedMatches/${this.userId}`;
    return this.http.get<UserMatch[]>(url, {
      headers: this.setHeaders(),
    });
  }
}
