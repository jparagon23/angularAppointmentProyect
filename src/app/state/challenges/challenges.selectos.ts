import { ChallengesState } from './challenges.reducers';
import { AppState } from '../app.state';
import { createSelector, select } from '@ngrx/store';

export const selectChallengeFeature = (state: AppState) => state.challenges;
export const selectUserChallengesState = createSelector(
  selectChallengeFeature,
  (state: ChallengesState) => ({
    userChallenges: state.userChallenges,
    loading: state.userChallengesLoading,
    success: state.userChallengesSuccess,
    error: state.userChallengesError,
  })
);

export const selectChallengesResultActionStatus = createSelector(
  selectChallengeFeature,
  (state: ChallengesState) => ({
    loading: state.challengeResultActionLoading,
    confirmSuccess: state.acceptChallengeSuccess,
    confirmFailure: state.acceptChallengeFailure,
    rejectSuccess: state.rejectChallengeSuccess,
    rejectFailure: state.rejectChallengeFailure,
    deleteSuccess: state.deleteChallengeSuccess,
    deleteFailure: state.rejectChallengeFailure,
  })
);

export const selectCreateChallengeStatus = createSelector(
  selectChallengeFeature,
  (state: ChallengesState) => ({
    loading: state.createChallengeLoading,
    success: state.createChallengeSuccess,
    failure: state.createChallengeFailure,
  })
);

export const selectChallengeRecommendations = createSelector(
  selectChallengeFeature,
  (state: ChallengesState) => ({
    recommendations: state.challengeRecommendations,
    loading: state.challengeRecommendationsLoading,
    error: state.challengeRecommendationsError,
  })
);
