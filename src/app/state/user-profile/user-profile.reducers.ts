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
  loadUserProfileSuccess,
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
  }))
);
