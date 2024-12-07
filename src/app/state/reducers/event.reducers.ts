import { createReducer, on } from '@ngrx/store';
import {
  publishMatchResult,
  publishMatchResultFailure,
  publishMatchResultSuccess,
  resetPostScoreStatus,
} from '../actions/event.actions';

export interface EventState {
  publishMatchResultLoading: boolean;
  publishMatchResultSuccess: boolean;
  publishMatchResultFailure: boolean;
  error: any;

  //
}

export const initialState: EventState = {
  publishMatchResultLoading: false,
  publishMatchResultSuccess: false,
  publishMatchResultFailure: false,
  error: null,
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
  }))
);
