import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { TokenService } from './token.service';
import { Store } from '@ngrx/store';
import { selectUser } from '../state/selectors/users.selectors';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { CourtDetail } from '../models/CourtDetail.model';
import { CreateCourt } from '../models/CreateCourt.model';

@Injectable({
  providedIn: 'root',
})
export class ClubConfigurationService {
  private readonly headers: HttpHeaders | undefined;
  private user!: User;

  constructor(
    private readonly http: HttpClient,
    private readonly tokenService: TokenService,
    private readonly store: Store<any>
  ) {
    // Combine both subscriptions into one
    this.store
      .select(selectUser)
      .pipe(
        filter((user) => !!user), // Ensure the user is defined
        take(1) // Take the first emitted value and complete
      )
      .subscribe((user) => {
        this.user = user!; // User is non-null at this point
      });
  }

  private setHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.tokenService.getToken()}`,
    });
  }

  getClubCourts(): Observable<CourtDetail[]> {
    const url = `${environment.API_URL}/configuration/club/${this.user?.userAdminClub}/courts`;
    return this.http.get<CourtDetail[]>(url, { headers: this.setHeaders() });
  }

  createCourt(court: CreateCourt): Observable<{ id: number }> {
    const url = `${environment.API_URL}/configuration/club/${this.user?.userAdminClub}/courts`;
    return this.http.post<CourtDetail>(url, court, {
      headers: this.setHeaders(),
    });
  }
}
