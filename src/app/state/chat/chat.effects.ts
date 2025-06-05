import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ChatService } from 'src/app/modules/chat/services/chat.service';
import {
  loadUnreadMessagesCount,
  loadUnreadMessagesCountFailure,
  loadUnreadMessagesCountSuccess,
} from './chat.actions';

@Injectable()
export class ChatEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly chatService: ChatService
  ) {}

  loadUnreadMessagesCount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUnreadMessagesCount),
      switchMap(() =>
        this.chatService.getUserUnreadMessagesCount().pipe(
          map((count) => loadUnreadMessagesCountSuccess({ count })),
          catchError((error) => of(loadUnreadMessagesCountFailure({ error })))
        )
      )
    )
  );
}
