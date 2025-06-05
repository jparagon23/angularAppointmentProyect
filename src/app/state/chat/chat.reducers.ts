import { createReducer, on } from '@ngrx/store';
import {
  decreaseUnreadMessagesCount,
  loadUnreadMessagesCountSuccess,
} from './chat.actions';

export interface ChatState {
  unreadMessagesCount: number;
}

export const initialChatState: ChatState = {
  unreadMessagesCount: 0,
};

export const chatReducer = createReducer(
  initialChatState,
  on(loadUnreadMessagesCountSuccess, (state, { count }) => ({
    ...state,
    unreadMessagesCount: count,
  })),
  on(decreaseUnreadMessagesCount, (state, { amount }) => ({
    ...state,
    unreadMessagesCount: Math.max(state.unreadMessagesCount - amount, 0),
  }))
);
