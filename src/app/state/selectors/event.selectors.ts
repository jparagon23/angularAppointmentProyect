import { createSelector } from '@ngrx/store';
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
