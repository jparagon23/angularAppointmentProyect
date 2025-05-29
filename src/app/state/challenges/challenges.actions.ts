import { createAction, props } from '@ngrx/store';
import { Challenge } from 'src/app/models/Challenge.model';
import { ChallengeRecommendation } from 'src/app/models/challenges/ChallengeRecommendation.model';
import { ChallengeResponseDTO } from 'src/app/models/challenges/UserChallenges.model';

export const getUserChallenges = createAction(
  '[Challenges] Get User Challenges',
  props<{
    userId?: number;
    matchType?: string;
    challengeStatus?: string[];
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
  }>()
);

export const getUserChallengesSuccess = createAction(
  '[Challenges] Get User Challenges Success',
  props<{ userChallenges: ChallengeResponseDTO[] }>()
);

export const getUserChallengesFailure = createAction(
  '[Challenges] Get User Challenges Failure',
  props<{ error: any }>()
);

export const acceptChallenge = createAction(
  '[Challenges] Accept Challenge',
  props<{ challengeId: number }>()
);

export const acceptChallengeSuccess = createAction(
  '[Challenges] Accept Challenge Success'
);

export const acceptChallengeFailure = createAction(
  '[Challenges] Accept Challenge Failure',
  props<{ error: any }>()
);

export const rejectChallenge = createAction(
  '[Challenges] Reject Challenge',
  props<{ challengeId: number }>()
);
export const rejectChallengeSuccess = createAction(
  '[Challenges] Reject Challenge Success'
);
export const rejectChallengeFailure = createAction(
  '[Challenges] Reject Challenge Failure',
  props<{ error: any }>()
);
export const deleteChallenge = createAction(
  '[Challenges] Delete Challenge',
  props<{ challengeId: number }>()
);
export const deleteChallengeSuccess = createAction(
  '[Challenges] Delete Challenge Success'
);
export const deleteChallengeFailure = createAction(
  '[Challenges] Delete Challenge Failure',
  props<{ error: any }>()
);

export const createChallenge = createAction(
  '[Challenges] Create Challenge',
  props<{ challenge: Challenge }>()
);
export const createChallengeSuccess = createAction(
  '[Challenges] Create Challenge Success'
);
export const createChallengeFailure = createAction(
  '[Challenges] Create Challenge Failure',
  props<{ error: any }>()
);

export const getChallengeRecomendations = createAction(
  '[Challenges] Get Challenge Recommendations',
  props<{
    userId?: number;
  }>()
);
export const getChallengeRecomendationsSuccess = createAction(
  '[Challenges] Get Challenge Recommendations Success',
  props<{ challengeRecommendations: ChallengeRecommendation[] }>()
);
export const getChallengeRecomendationsFailure = createAction(
  '[Challenges] Get Challenge Recommendations Failure',
  props<{ error: any }>()
);

export const resetChallengeModalState = createAction(
  '[Challenges] Reset Challenge Modal State'
);
