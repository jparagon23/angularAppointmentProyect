import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { UserReservationResponse } from '../models/UserReservations.model';
import { BehaviorSubject } from 'rxjs';
import { TokenService } from './token.service';
import { Store } from '@ngrx/store';
import { selectUser } from '../state/selectors/users.selectors';
import { MatchResultDto } from '../models/PostResult.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
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

  publishMatchResult(matchResult: MatchResultDto) {
    const url = `${environment.API_URL}/event/post-match-result`;
    return this.http.post(url, matchResult, {
      headers: this.setHeaders(),
    });
  }
}
