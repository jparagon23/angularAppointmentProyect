import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { TokenService } from './token.service';
import { Store } from '@ngrx/store';
import { selectUser } from '../state/selectors/users.selectors';
import { environment } from 'src/environments/environment';
import { Challenge } from '../models/Challenge.model';
import { ChallengePageResponse } from '../models/challenges/UserChallenges.model';
import { Observable } from 'rxjs';
import { ChallengeRecommendation } from '../models/challenges/ChallengeRecommendation.model';

@Injectable({
  providedIn: 'root',
})
export class ChallengeService {
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

  createChallenge(createChallenge: Challenge) {
    const url = `${environment.API_URL}/challenge`;
    return this.http.post(url, createChallenge, {
      headers: this.setHeaders(),
    });
  }

  getUserChallenges(
    userId?: number,
    matchType?: string,
    challengeStatus?: string[],
    page: number = 0,
    size: number = 10,
    sortBy: string = 'challengeDateTime',
    sortDir: 'asc' | 'desc' = 'desc'
  ): Observable<ChallengePageResponse> {
    // Usa el userId proporcionado o el almacenado en el servicio
    const finalUserId = userId ?? this.userId;

    if (!finalUserId) {
      throw new Error('User ID is undefined');
    }

    const params: any = {
      page,
      size,
      sortBy,
      sortDir,
    };

    if (matchType) {
      params.matchType = matchType;
    }

    if (challengeStatus) {
      params.challengeStatus = challengeStatus;
    }

    const url = `${environment.API_URL}/challenge/${finalUserId}`;

    return this.http.get<ChallengePageResponse>(url, {
      headers: this.setHeaders(),
      params,
    });
  }

  acceptChallenge(challengeId: number) {
    const url = `${environment.API_URL}/challenge/${challengeId}/accept`;
    return this.http.patch(url, null, {
      headers: this.setHeaders(),
    });
  }

  rejectChallenge(challengeId: number) {
    const url = `${environment.API_URL}/challenge/${challengeId}/reject`;
    return this.http.patch(url, null, {
      headers: this.setHeaders(),
    });
  }

  deleteChallenge(challengeId: number) {
    const url = `${environment.API_URL}/challenge/${challengeId}`;
    return this.http.delete(url, {
      headers: this.setHeaders(),
    });
  }

  getChallengeRecommendations(
    userId?: number
  ): Observable<ChallengeRecommendation[]> {
    userId ??= this.userId;
    const url = `${environment.API_URL}/recommendations/challenges/${userId}`;
    return this.http.get<ChallengeRecommendation[]>(url, {
      headers: this.setHeaders(),
    });
  }
}
