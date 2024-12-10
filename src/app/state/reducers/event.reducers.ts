import { createReducer, on } from '@ngrx/store';
import {
  getUserMatches,
  getUserMathcesFailure,
  getUserMathcesSuccess,
  publishMatchResult,
  publishMatchResultFailure,
  publishMatchResultSuccess,
  resetPostScoreStatus,
} from '../actions/event.actions';
import { UserMatch } from 'src/app/models/events/UserMatch.model';

export interface EventState {
  publishMatchResultLoading: boolean;
  publishMatchResultSuccess: boolean;
  publishMatchResultFailure: boolean;
  error: any;

  getUserMatchesLoading: boolean;
  getUserMatchesSuccess: boolean;
  getUserMatchesFailure: boolean;
  userMatches: UserMatch[];

  //
}

export const initialState: EventState = {
  publishMatchResultLoading: false,
  publishMatchResultSuccess: false,
  publishMatchResultFailure: false,
  error: null,
  getUserMatchesLoading: false,
  getUserMatchesSuccess: false,
  getUserMatchesFailure: false,
  userMatches: [],
};

export const matchReducer = createReducer(
  initialState,
  on(publishMatchResult, (state) => ({
    ...state,
    publishMatchResult: true,
  })),
  on(publishMatchResultSuccess, (state) => ({
    ...state,
    publishMatchResultLoading: false,
    publishMatchResultSuccess: true,
  })),
  on(publishMatchResultFailure, (state, { error }) => ({
    ...state,
    publishMatchResultLoading: false,
    publishMatchResultFailure: true,
    error: error,
  })),
  on(resetPostScoreStatus, (state) => ({
    ...state,
    publishMatchResultLoading: false,
    publishMatchResultSuccess: false,
    publishMatchResultFailure: false,
  })),
  on(getUserMatches, (state) => ({
    ...state,
    getUserMatchesLoading: true,
  })),
  on(getUserMathcesSuccess, (state, matches) => ({
    ...state,
    getUserMatchesLoading: false,
    getUserMatchesSuccess: true,
    userMatches: matches.matches,
  })),
  on(getUserMathcesFailure, (state, { error }) => ({
    ...state,
    getUserMatchesLoading: false,
    getUserMatchesFailure: true,
    error: error,
  }))
);
