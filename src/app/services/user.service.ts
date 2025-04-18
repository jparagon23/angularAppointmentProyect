import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TokenService } from './token.service';
import { selectUser } from '../state/selectors/users.selectors';
import { User } from '../models/user.model';
import { ClubUser } from '../models/clubUsers.model';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user!: User;
  private headers: HttpHeaders | undefined;

  constructor(
    private readonly http: HttpClient,
    private readonly tokenService: TokenService,
    private readonly store: Store<any>
  ) {
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

  getClubUserByNameOrId(name: string): Observable<ClubUser[]> {
    const url = `${environment.API_URL}/active-users?nameOrId=${name}`;
    return this.http.get<ClubUser[]>(url, { headers: this.setHeaders() });
  }

  updateUser(user: Partial<User>): Observable<User> {
    const url = `${environment.API_URL}/user/${this.user.id}`;
    return this.http.put<User>(url, user, { headers: this.setHeaders() });
  }

  getUserById(id: number): Observable<User> {
    const url = `${environment.API_URL}/profile/${id}`;
    return this.http
      .get<{ data: User[] }>(url, { headers: this.setHeaders() })
      .pipe(map((response) => response.data?.[0]));
  }
}
