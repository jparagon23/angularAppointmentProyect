import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { DashboardState } from './dashboard.reducers';

export const selectDahboardFeature = (state: AppState) => state.dashboard;

export const selectDashboardState = createSelector(
  selectDahboardFeature,
  (state: DashboardState) => ({
    loadingMatches: state.loadingMatches,
    last10SinglesMatches: state.last10SinglesMatches,
    last10DoublesMatches: state.last10DoublesMatches,
    error: state.error,
  })
);
