import { User } from './../../models/user.model';
import { createSelector } from '@ngrx/store';
import { UserState } from 'src/app/models/user.state';
import { AppState } from '../app.state';

export const selectUsersFeature = (state: AppState) => state.user;

export const selectUser = createSelector(
  selectUsersFeature,
  (state) => state.user
);

export const selectUsersLoading = createSelector(
  selectUsersFeature,
  (state) => state.loading
);

export const selectUsersError = createSelector(
  selectUsersFeature,
  (state) => state.error
);
