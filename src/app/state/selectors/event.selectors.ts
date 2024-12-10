import { createSelector, select } from '@ngrx/store';
import { AppState } from '../app.state';
import { EventState } from '../reducers/event.reducers';

export const selectEventsFeature = (state: AppState) => state.events;

export const selectPostScoreStatus = createSelector(
  selectEventsFeature,
  (state: EventState) => ({
    loading: state.publishMatchResultLoading,
    success: state.publishMatchResultSuccess,
    failure: state.publishMatchResultFailure,
  })
);

export const selectGetUserMatchesStatus = createSelector(
  selectEventsFeature,
  (state: EventState) => ({
    loading: state.getUserMatchesLoading,
    success: state.getUserMatchesSuccess,
    failure: state.getUserMatchesFailure,
    userMatch: state.userMatches,
  })
);
