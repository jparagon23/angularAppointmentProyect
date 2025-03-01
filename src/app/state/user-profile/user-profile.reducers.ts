import { createReducer, on } from '@ngrx/store';
import { UserMatch } from 'src/app/models/events/UserMatch.model';
import { UserMatchesStats } from 'src/app/models/events/UserMatchesStats.model';
import { User } from 'src/app/models/user.model';
import {
  loadUserProfile,
  loadUserProfileFailure,
  loadUserProfileMatches,
  loadUserProfileMatchesFailure,
  loadUserProfileMatchesSuccess,
  loadUserProfileStats,
  loadUserProfileStatsFailure,
  loadUserProfileStatsSuccess,
  loadUserProfileSuccess,
  resetUserProfileState,
} from './user-profile.actions';

export interface UserProfileState {
  userProfile: User | null;
  loadingUserProfile: boolean;
  userProfileSuccess: boolean;
  userProfileFailure: boolean;
  error: any;

  userMatches: UserMatch[];
  loadingUserMatches: boolean;
  userMatchesSuccess: boolean;
  userMatchesFailure: boolean;
  errorUserMatches: any;

  userStats?: UserMatchesStats;
  loadingUserStats: boolean;
  userStatsSuccess: boolean;
  userStatsFailure: boolean;
  errorUserStats: any;
}

export const initialState: UserProfileState = {
  userProfile: null,
  userProfileSuccess: false,
  userProfileFailure: false,
  loadingUserProfile: false,
  error: undefined,

  userMatches: [],
  loadingUserMatches: false,
  userMatchesSuccess: false,
  userMatchesFailure: false,
  errorUserMatches: undefined,

  userStats: undefined,
  loadingUserStats: false,
  userStatsSuccess: false,
  userStatsFailure: false,
  errorUserStats: undefined,
};

export const userProfileReducer = createReducer(
  initialState,
  on(loadUserProfile, (state: UserProfileState) => ({
    ...state,
    loadingUserProfile: true,
  })),
  on(loadUserProfileSuccess, (state: UserProfileState, { userProfile }) => ({
    ...state,
    userProfile,
    loadingUserProfile: false,
    userProfileSuccess: true,
  })),
  on(loadUserProfileFailure, (state: UserProfileState, { error }) => ({
    ...state,
    error,
    loadingUserProfile: false,
    userProfileFailure: true,
  })),
  on(loadUserProfileMatches, (state: UserProfileState) => ({
    ...state,
    loadingUserMatches: true,
  })),
  on(loadUserProfileMatchesSuccess, (state: UserProfileState, { matches }) => ({
    ...state,
    userMatches: matches,
    loadingUserMatches: false,
    userMatchesSuccess: true,
  })),
  on(loadUserProfileMatchesFailure, (state: UserProfileState, { error }) => ({
    ...state,
    errorUserMatches: error,
    loadingUserMatches: false,
    userMatchesFailure: true,
  })),
  on(loadUserProfileStats, (state: UserProfileState) => ({
    ...state,
    loadingUserStats: true,
  })),
  on(loadUserProfileStatsSuccess, (state: UserProfileState, { stats }) => ({
    ...state,
    userStats: stats,
    loadingUserStats: false,
    userStatsSuccess: true,
  })),
  on(loadUserProfileStatsFailure, (state: UserProfileState, { error }) => ({
    ...state,
    errorUserStats: error,
    loadingUserStats: false,
    userStatsFailure: true,
  })),
  on(resetUserProfileState, () => initialState)
);
