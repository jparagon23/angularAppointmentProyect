import { updateUser, updateUserFailure } from './../actions/users.actions';
import { createSelector } from '@ngrx/store';
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

export const selectUpdateUserInfo = createSelector(
  selectUsersFeature,
  (state) => ({
    updateUserLoading: state.updateUserLoading,
    updateUserSuccess: state.updateUserSuccess,
    updateUserFailure: state.updateUserFailure,
  })
);
