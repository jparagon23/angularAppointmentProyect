import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { UserProfileState } from './user-profile.reducers';

export const selectUserProfileFeature = (state: AppState) =>
  state.userProfileView;

export const selectUserProfileStatus = createSelector(
  selectUserProfileFeature,
  (state: UserProfileState) => ({
    loading: state.loadingUserProfile,
    success: state.userProfileSuccess,
    failure: state.userProfileFailuere,
    userProfile: state.userProfile,
  })
);
