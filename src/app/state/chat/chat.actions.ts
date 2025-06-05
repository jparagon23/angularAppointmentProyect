import { createAction, props } from '@ngrx/store';

export const loadUnreadMessagesCount = createAction(
  '[Chat] Load Unread Messages Count'
);

export const loadUnreadMessagesCountSuccess = createAction(
  '[Chat] Load Unread Messages Count Success',
  props<{ count: number }>()
);

export const loadUnreadMessagesCountFailure = createAction(
  '[Chat] Load Unread Messages Count Failure',
  props<{ error: any }>()
);

export const decreaseUnreadMessagesCount = createAction(
  '[Chat] Decrease Unread Messages Count',
  props<{ amount: number }>()
);
