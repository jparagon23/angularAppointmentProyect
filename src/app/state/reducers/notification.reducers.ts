import { createReducer, on } from '@ngrx/store';
import { NotificationItem } from 'src/app/models/notification/NotificationItem.model';
import {
  loadUserNotifications,
  loadUserNotificationsFailure,
  loadUserNotificationsSuccess,
} from '../actions/notification.actions';

export interface NotificationState {
  loadingUserNotification: boolean;
  userNotificationSuccess: boolean;
  userNotificationFailure: boolean;
  userNotifications: NotificationItem[];
  error: any;
}

export const initialState: NotificationState = {
  loadingUserNotification: false,
  userNotificationSuccess: false,
  userNotificationFailure: false,
  userNotifications: [],
  error: null,
};

export const notificationReducer = createReducer(
  initialState,
  on(loadUserNotifications, (state) => ({
    ...state,
    loadingUserNotification: true,
  })),
  on(loadUserNotificationsSuccess, (state, { notification }) => ({
    ...state,
    loadingUserNotification: false,
    userNotificationSuccess: true,
    userNotifications: notification,
  })),
  on(loadUserNotificationsFailure, (state, { error }) => ({
    ...state,
    loadingUserNotification: false,
    userNotificationFailure: true,
    error: error,
  }))
);
