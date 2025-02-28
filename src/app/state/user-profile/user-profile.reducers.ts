import { createReducer, on } from '@ngrx/store';
import { UserMatch } from 'src/app/models/events/UserMatch.model';
import { UserMatchesStats } from 'src/app/models/events/UserMatchesStats.model';
import { User } from 'src/app/models/user.model';
import {
  loadUserProfile,
  loadUserProfileFailure,
  loadUserProfileSuccess,
} from './user-profile.actions';

export interface UserProfileState {
  userProfile: User | null;
  loadingUserProfile: boolean;
  userProfileSuccess: boolean;
  userProfileFailuere: boolean;

  error: any;
  userMatches: UserMatch[];
  loadingUserMatches: boolean;
  errorUserMatches: any;
  userStats?: UserMatchesStats;
  loadingUserStats: boolean;
  errorUserStats: any;
}

export const initialState: UserProfileState = {
  userProfile: null,
  userProfileSuccess: false,
  userProfileFailuere: false,
  loadingUserProfile: false,
  error: undefined,
  userMatches: [],
  loadingUserMatches: false,
  errorUserMatches: undefined,
  userStats: undefined,
  loadingUserStats: false,
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
    userProfileFailuere: true,
  }))
);
