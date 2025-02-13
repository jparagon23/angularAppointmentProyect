import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { TokenService } from './token.service';
import { Store } from '@ngrx/store';
import { AppState } from '../state/app.state';
import { selectUser } from '../state/selectors/users.selectors';
import { environment } from 'src/environments/environment';
import { NotificationItem } from '../models/notification/NotificationItem.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private userId: number | undefined;
  private headers: HttpHeaders | undefined;
  private user!: User;

  constructor(
    private readonly http: HttpClient,
    private readonly tokenService: TokenService,
    private readonly store: Store<AppState>
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

  getUserNotifications(): Observable<NotificationItem[]> {
    const url = `${environment.API_URL}/notifications/panel/user/${this.userId}`;
    return this.http.get<NotificationItem[]>(url, {
      headers: this.setHeaders(),
    });
  }

  markNotificationAsRead(notificationId: number) {
    const url = `${environment.API_URL}/notifications/${notificationId}/read`;
    return this.http.patch(
      url,
      {},
      {
        headers: this.setHeaders(),
      }
    );
  }
}
