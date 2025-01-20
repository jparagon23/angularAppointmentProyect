import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { NotificationState } from '../reducers/notification.reducers';
export const selectNotificationFeature = (state: AppState) =>
  state.notifications;

export const selectNotificationStatus = createSelector(
  selectNotificationFeature,
  (state: NotificationState) => ({
    loading: state.loadingUserNotification,
    success: state.userNotificationSuccess,
    failure: state.userNotificationFailure,
    userNotifications: state.userNotifications,
    error: state.error,
  })
);

export const selectUserNotifications = createSelector(
  selectNotificationFeature,
  (state: NotificationState) => state.userNotifications
);
