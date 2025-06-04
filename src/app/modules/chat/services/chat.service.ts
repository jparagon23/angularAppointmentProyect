import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { User } from 'src/app/models/user.model';
import { TokenService } from 'src/app/services/token.service';
import { selectUser } from 'src/app/state/selectors/users.selectors';
import { Conversation } from '../models/Conversation.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Message } from '../models/Message.model';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
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

  getMessagesBetweenUsers(chatId: number): Observable<Message[]> {
    const url = `${environment.API_URL}/chat/messages`;
    const headers = this.setHeaders();

    const params = new HttpParams().set('chatId', chatId.toString());
    return this.http.get<Message[]>(url, {
      headers,
      params,
    });
  }

  getUserConversations(userId: number): Observable<Conversation[]> {
    const url = `${environment.API_URL}/chat/conversations`;
    this.headers = this.setHeaders();

    const params = new HttpParams().set('userId', userId.toString());

    return this.http.get<Conversation[]>(url, {
      headers: this.headers,
      params: params,
    });
  }

  sendMessage(arg0: {
    senderId: number;
    receiverId: number | null;
    content: string;
  }) {
    const url = `${environment.API_URL}/chat/send-message`;
    const headers = this.setHeaders();
    const body = {
      senderId: arg0.senderId,
      receiverId: arg0.receiverId,
      content: arg0.content,
    };
    return this.http.post<Message>(url, body, { headers });
  }

  markAsRead(chatId: number): Observable<void> {
    const url = `${environment.API_URL}/chat/messages/mark-as-read?chatId=${chatId}&receiverId=${this.userId}`;
    const headers = this.setHeaders();
    return this.http.put<void>(url, null, { headers });
  }
}
