import { createReducer, on } from '@ngrx/store';
import {
  confirmMatchResult,
  confirmMatchResultFailure,
  confirmMatchResultSuccess,
  deleteMatchResult,
  deleteMatchResultFailure,
  deleteMatchResultSuccess,
  getUserMatches,
  getUserMatchesStats,
  getUserMatchesStatsFailure,
  getUserMatchesStatsSuccess,
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
  resetUserMatchesStatsState,
} from '../actions/event.actions';
import { UserMatch } from 'src/app/models/events/UserMatch.model';
import { UserMatchesStats } from 'src/app/models/events/UserMatchesStats.model';

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

  getUserMatchesStatsLoading: boolean;
  getUserMatchesStatsSuccess: boolean;
  getUserMatchesStatsFailure: boolean;
  userMatchesStats?: UserMatchesStats;

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
  getUserMatchesStatsLoading: false,
  getUserMatchesStatsSuccess: false,
  getUserMatchesStatsFailure: false,
  userMatchesStats: undefined,
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
  })),
  on(getUserMatchesStats, (state) => ({
    ...state,
    getUserMatchesStatsLoading: true,
  })),
  on(getUserMatchesStatsSuccess, (state, stats) => ({
    ...state,
    getUserMatchesStatsLoading: false,
    getUserMatchesStatsSuccess: true,
    userMatchesStats: stats.stats,
  })),
  on(getUserMatchesStatsFailure, (state, { error }) => ({
    ...state,
    getUserMatchesStatsLoading: false,
    getUserMatchesStatsFailure: true,
    error: error,
  })),
  on(resetUserMatchesStatsState, (state) => ({
    ...state,
    getUserMatchesStatsLoading: false,
    getUserMatchesStatsSuccess: false,
    getUserMatchesStatsFailure: false,
  }))
);
