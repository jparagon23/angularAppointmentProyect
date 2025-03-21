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

export const selectUserMatchState = createSelector(
  selectEventsFeature,
  (state: EventState) => ({
    loading: state.getUserMatchesStatsLoading,
    success: state.getUserMatchesStatsSuccess,
    failure: state.getUserMatchesStatsFailure,
    userMatchesStats: state.userMatchesStats,
    lastUpdated: state.lastUpdatedStats,
  })
);

export const selectRankingState = createSelector(
  selectEventsFeature,
  (state: EventState) => ({
    loading: state.getRankingLoading,
    success: state.getRankingSuccess,
    failure: state.getRankingFailure,
    ranking: state.ranking,
  })
);

export const selectAdminPostedMatchesState = createSelector(
  selectEventsFeature,
  (state: EventState) => ({
    loading: state.adminPostedMatchesLoading,
    success: state.adminPostedMatchesSuccess,
    failure: state.adminPostedMatchesFailure,
    adminPostedMatches: state.adminPostedMatches,
  })
);
