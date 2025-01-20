import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { NotificationService } from 'src/app/services/notification.service';
import { AppState } from '../app.state';
import { catchError, map, mergeMap, of } from 'rxjs';
import {
  loadUserNotifications,
  loadUserNotificationsFailure,
  loadUserNotificationsSuccess,
  markNotificationAsRead,
} from '../actions/notification.actions';

@Injectable()
export class NotificationEffect {
  constructor(
    private readonly actions$: Actions,
    private readonly notificationService: NotificationService,
    private readonly store: Store<AppState>
  ) {}

  loadUserNotifications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUserNotifications),
      mergeMap(() =>
        this.notificationService.getUserNotifications().pipe(
          map((notification) =>
            loadUserNotificationsSuccess({
              notification: notification,
            })
          ),
          catchError((error) => of(loadUserNotificationsFailure({ error })))
        )
      )
    )
  );

  markNotificationAsRead$ = createEffect(() =>
    this.actions$.pipe(
      ofType(markNotificationAsRead),
      mergeMap((notification) => {
        return this.notificationService.markNotificationAsRead(
          notification.notificationId
        );
      }),
      map(() => loadUserNotifications())
    )
  );
}
