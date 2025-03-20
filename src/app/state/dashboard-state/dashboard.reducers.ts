import { UserMatch } from 'src/app/models/events/UserMatch.model';
import {
  getLast10DoublesMatches,
  getLast10DoublesMatchesFailure,
  getLast10DoublesMatchesSuccess,
  getLast10SinglesMatches,
  getLast10SinglesMatchesFailure,
  getLast10SinglesMatchesSuccess,
} from './dashboard.actions';
import { createReducer, on } from '@ngrx/store';

export interface DashboardState {
  last10SinglesMatches: UserMatch[];
  last10DoublesMatches: UserMatch[];
  loadingMatches: boolean;
  error: any;
}

export const initialState: DashboardState = {
  last10SinglesMatches: [],
  last10DoublesMatches: [],
  loadingMatches: false,
  error: null,
};

export const dashboardReducer = createReducer(
  initialState,
  on(getLast10SinglesMatches, (state) => ({
    ...state,
    loadingMatches: true,
  })),
  on(getLast10SinglesMatchesSuccess, (state, { matches }) => ({
    ...state,
    last10SinglesMatches: matches,
    loadingMatches: false,
  })),
  on(getLast10SinglesMatchesFailure, (state, { error }) => ({
    ...state,
    loadingMatches: false,
    error,
  })),
  on(getLast10DoublesMatches, (state) => ({
    ...state,
    loadingMatches: true,
  })),
  on(getLast10DoublesMatchesSuccess, (state, { matches }) => ({
    ...state,
    last10DoublesMatches: matches,
    loadingMatches: false,
  })),
  on(getLast10DoublesMatchesFailure, (state, { error }) => ({
    ...state,
    loadingMatches: false,
    error,
  }))
);
