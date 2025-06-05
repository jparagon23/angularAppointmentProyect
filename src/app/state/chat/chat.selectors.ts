import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ChatState } from './chat.reducers';

export const selectChatState = createFeatureSelector<ChatState>('chat');

export const selectUnreadMessagesCount = createSelector(
  selectChatState,
  (state) => state.unreadMessagesCount
);
