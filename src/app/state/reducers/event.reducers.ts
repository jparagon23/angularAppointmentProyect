import { createReducer, on } from '@ngrx/store';
import {
  confirmMatchResult,
  confirmMatchResultFailure,
  confirmMatchResultSuccess,
  deleteMatchResult,
  deleteMatchResultFailure,
  deleteMatchResultSuccess,
  getUserMatches,
  getUserMathcesFailure,
  getUserMathcesSuccess,
  publishMatchResult,
  publishMatchResultFailure,
  publishMatchResultSuccess,
  rejectMatchResult,
  rejectMatchResultFailure,
  rejectMatchResultSuccess,
  resetMatchResultState,
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

  MatchResultActionLoading: boolean;

  confirmMatchResultSuccess: boolean;
  confirmMatchResultFailure: boolean;

  rejectMatchResultSuccess: boolean;
  rejectMatchResultFailure: boolean;

  deleteMatchResultSuccess: boolean;
  deleteMatchResultFailure: boolean;

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
  MatchResultActionLoading: false,
  confirmMatchResultSuccess: false,
  confirmMatchResultFailure: false,
  rejectMatchResultSuccess: false,
  rejectMatchResultFailure: false,
  deleteMatchResultSuccess: false,
  deleteMatchResultFailure: false,
};

export const matchReducer = createReducer(
  initialState,
  on(publishMatchResult, (state) => ({
    ...state,
    publishMatchResultLoading: true,
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
  })),
  on(confirmMatchResult, rejectMatchResult, (state) => ({
    ...state,
    MatchResultActionLoading: true,
  })),
  on(confirmMatchResultSuccess, (state) => ({
    ...state,
    MatchResultActionLoading: false,
    confirmMatchResultSuccess: true,
  })),
  on(confirmMatchResultFailure, (state, { error }) => ({
    ...state,
    MatchResultActionLoading: false,
    confirmMatchResultFailure: true,
    error: error,
  })),
  on(rejectMatchResultSuccess, (state) => ({
    ...state,
    MatchResultActionLoading: false,
    rejectMatchResultSuccess: true,
  })),
  on(rejectMatchResultFailure, (state, { error }) => ({
    ...state,
    MatchResultActionLoading: false,
    rejectMatchResultFailure: true,
    error: error,
  })),
  on(resetMatchResultState, (state) => ({
    ...state,
    MatchResultActionLoading: false,
    confirmMatchResultSuccess: false,
    confirmMatchResultFailure: false,
    rejectMatchResultSuccess: false,
    rejectMatchResultFailure: false,
    deleteMatchResultSuccess: false,
    deleteMatchResultFailure: false,
  })),
  on(deleteMatchResult, (state) => ({
    ...state,
    MatchResultActionLoading: true,
  })),
  on(deleteMatchResultSuccess, (state) => ({
    ...state,
    MatchResultActionLoading: false,
    deleteMatchResultSuccess: true,
  })),
  on(deleteMatchResultFailure, (state, { error }) => ({
    ...state,
    MatchResultActionLoading: false,
    deleteMatchResultFailure: true,
    error: error,
  }))
);
