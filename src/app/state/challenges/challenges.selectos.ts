import { ChallengesState } from './challenges.reducers';
import { AppState } from '../app.state';
import { createSelector } from '@ngrx/store';

export const selectChallengeFeature = (state: AppState) => state.challenges;
export const selectUserChallenges = createSelector(
  selectChallengeFeature,
  (state: ChallengesState) => state.userChallenges
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
