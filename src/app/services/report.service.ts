import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { TokenService } from './token.service';
import { Store } from '@ngrx/store';
import { selectUser } from '../state/selectors/users.selectors';
import { filter, Observable, take } from 'rxjs';
import { ClubReportDTO } from '../models/ClubReport.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private headers: HttpHeaders | undefined;
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
    this.headers = new HttpHeaders({
      Authorization: `Bearer ${this.tokenService.getToken()}`,
    });

    return this.headers;
  }

  getClubReports(
    initialDate: string,
    endDate: string
  ): Observable<ClubReportDTO> {
    const params = {
      initialDate: initialDate,
      endDate: endDate,
    };
    const url = `${environment.API_URL}/reports/club/${this.user?.userAdminClub}`;
    return this.http.get<ClubReportDTO>(url, {
      headers: this.setHeaders(),
      params,
    });
  }
}
