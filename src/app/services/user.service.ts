import { authGuard } from './../guards/auth.guard';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserReservationResponse } from '../models/UserReservations.model';
import { TokenService } from './token.service';
import { AuthService } from './auth.service';
import { selectUser } from '../state/selectors/users.selectors';
import { User } from '../models/user.model';
import { ClubUser } from '../models/clubUsers.model';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user!: User;
  private headers: HttpHeaders | undefined;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private authService: AuthService,
    private store: Store<any>
  ) {
    this.store.select(selectUser).subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });
  }

  private setHeaders(): HttpHeaders {
    console.log('setting headers');

    this.headers = new HttpHeaders({
      Authorization: `Bearer ${this.tokenService.getToken()}`,
    });

    return this.headers;
  }

  getClubUserByNameOrId(name: string): Observable<ClubUser[]> {
    const url = `${environment.API_URL}/reservation/club/${this.user.userAdminClub}/members?nameOrId=${name}`;
    return this.http
      .get<ClubUser[]>(url, { headers: this.setHeaders() })
      .pipe(tap((response) => console.log('Response:', response)));
  }
}
