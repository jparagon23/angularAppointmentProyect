import { createAction, props } from '@ngrx/store';
import { NotificationItem } from 'src/app/models/notification/NotificationItem.model';

export const loadUserNotifications = createAction(
  '[dashboard] Load User Notifications'
);

export const loadUserNotificationsSuccess = createAction(
  '[dashboard] Load User Notifications Success',
  props<{ notification: NotificationItem[] }>()
);

export const loadUserNotificationsFailure = createAction(
  '[dashboard] Load User Notifications Failure',
  (error: any) => ({ error })
);

export const markNotificationAsRead = createAction(
  '[dashboard] Mark Notification As Read',
  props<{ notificationId: number }>()
);
