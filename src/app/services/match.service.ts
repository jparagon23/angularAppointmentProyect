import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';
import { Store } from '@ngrx/store';
import { selectUser } from '../state/selectors/users.selectors';
import { MatchResultDto } from '../models/PostResult.model';
import { environment } from 'src/environments/environment';
import { UserMatch } from '../models/events/UserMatch.model';

@Injectable({
  providedIn: 'root',
})
export class MatchService {
  private userId: number | undefined;
  private headers: HttpHeaders | undefined;
  private user!: User;

  private cachedMatches: UserMatch[] | null = null; // Cache variable

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

  getUserMatches(): Observable<UserMatch[]> {
    const url = `${environment.API_URL}/match/user/${this.userId}`;
    return this.http.get<UserMatch[]>(url, {
      headers: this.setHeaders(),
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

  getUserMatchesStats(matchType: string): Observable<any> {
    const url = `${environment.API_URL}/match/statistics/${this.userId}/${matchType}`;
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
