import { createSelector, select } from '@ngrx/store';
import { AppState } from '../app.state';
import { EventState } from '../reducers/event.reducers';
import { selectUser } from './users.selectors';

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

export const selectUserMatches = createSelector(
  selectEventsFeature,
  (state: EventState) => state.userMatches
);

export const selectMatchResultActionStatus = createSelector(
  selectEventsFeature,
  (state: EventState) => ({
    loading: state.MatchResultActionLoading,
    confirmSuccess: state.confirmMatchResultSuccess,
    confirmFailure: state.confirmMatchResultFailure,
    rejectSuccess: state.rejectMatchResultSuccess,
    rejectFailure: state.rejectMatchResultFailure,
    deleteSuccess: state.deleteMatchResultSuccess,
    deleteFailure: state.deleteMatchResultFailure,
  })
);
