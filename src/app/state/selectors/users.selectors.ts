import { User } from './../../models/user.model';
import { createSelector } from '@ngrx/store';
import { UserState } from 'src/app/models/user.state';
import { AppState } from '../app.state';

export const selectUsersFeature = (state: AppState) => state.user;

export const selectUser = createSelector(
  selectUsersFeature,
  (state: UserState) => state.user
);

export const selectUsersLoading = createSelector(
  selectUsersFeature,
  (state: UserState) => state.loading
);
