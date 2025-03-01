import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { UserProfileState } from './user-profile.reducers';

export const selectUserProfileFeature = (state: AppState) =>
  state.userProfileView;

export const selectUserProfileStatus = createSelector(
  selectUserProfileFeature,
  (state: UserProfileState) => ({
    loadingUserProfile: state.loadingUserProfile,
    userProfileSuccess: state.userProfileSuccess,
    userProfileFailure: state.userProfileFailure,
    userProfile: state.userProfile,

    loadingUserMatches: state.loadingUserMatches,
    userMatchesSuccess: state.userMatchesSuccess,
    userMatchesFailuere: state.userMatchesFailure,
    userMatches: state.userMatches,

    loadingUserStats: state.loadingUserStats,
    userStatsSuccess: state.userStatsSuccess,
    userStatsFailure: state.userStatsFailure,
    userStats: state.userStats,
  })
);
