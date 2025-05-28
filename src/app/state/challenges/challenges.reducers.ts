import { createReducer, on } from '@ngrx/store';
import { ChallengeResponseDTO } from 'src/app/models/challenges/UserChallenges.model';
import {
  acceptChallenge,
  acceptChallengeFailure,
  acceptChallengeSuccess,
  createChallenge,
  createChallengeFailure,
  createChallengeSuccess,
  deleteChallenge,
  deleteChallengeFailure,
  deleteChallengeSuccess,
  getUserChallenges,
  getUserChallengesFailure,
  getUserChallengesSuccess,
  rejectChallenge,
  rejectChallengeFailure,
  rejectChallengeSuccess,
} from './challenges.actions';

export interface ChallengesState {
  userChallenges: ChallengeResponseDTO[];
  userChallengesSuccess: boolean;
  userChallengesLoading: boolean;

  challengeResultActionLoading?: boolean;

  acceptChallengeSuccess?: boolean;
  acceptChallengeFailure?: any;

  rejectChallengeSuccess?: boolean;
  rejectChallengeFailure?: any;

  deleteChallengeSuccess?: boolean;
  deleteChallengeFailure?: any;

  createChallengeLoading?: boolean;
  createChallengeSuccess?: boolean;
  createChallengeFailure?: any;

  userChallengesError: any;
}

export const initialState: ChallengesState = {
  userChallenges: [],
  userChallengesSuccess: false,
  userChallengesLoading: false,
  userChallengesError: null,
};

export const challengesReducer = createReducer(
  initialState,

  on(getUserChallenges, (state: ChallengesState) => ({
    ...state,
    userChallengesLoading: true,
    userChallengesSuccess: false,
    userChallengesError: null,
  })),

  on(
    getUserChallengesSuccess,
    (state: ChallengesState, { userChallenges }) => ({
      ...state,
      userChallenges: userChallenges,
      userChallengesSuccess: true,
      userChallengesLoading: false,
      userChallengesError: null,
    })
  ),

  on(getUserChallengesFailure, (state: ChallengesState, { error }) => ({
    ...state,
    userChallengesSuccess: false,
    userChallengesLoading: false,
    userChallengesError: error,
  })),
  on(acceptChallenge, (state: ChallengesState) => ({
    ...state,
    challengeResultActionLoading: true,
  })),
  on(acceptChallengeSuccess, (state: ChallengesState) => ({
    ...state,
    challengeResultActionLoading: false,
    acceptChallengeSuccess: true,
  })),
  on(acceptChallengeFailure, (state: ChallengesState, { error }) => ({
    ...state,
    challengeResultActionLoading: false,
    acceptChallengeFailure: error,
  })),
  on(rejectChallenge, (state: ChallengesState) => ({
    ...state,
    challengeResultActionLoading: true,
  })),
  on(rejectChallengeSuccess, (state: ChallengesState) => ({
    ...state,
    challengeResultActionLoading: false,
    rejectChallengeSuccess: true,
  })),
  on(rejectChallengeFailure, (state: ChallengesState, { error }) => ({
    ...state,
    challengeResultActionLoading: false,
    rejectChallengeFailure: error,
  })),
  on(deleteChallenge, (state: ChallengesState) => ({
    ...state,
    challengeResultActionLoading: true,
  })),
  on(deleteChallengeSuccess, (state: ChallengesState) => ({
    ...state,
    challengeResultActionLoading: false,
    deleteChallengeSuccess: true,
  })),
  on(deleteChallengeFailure, (state: ChallengesState, { error }) => ({
    ...state,
    challengeResultActionLoading: false,
    deleteChallengeFailure: error,
  })),
  on(createChallenge, (state: ChallengesState) => ({
    ...state,
    createChallengeLoading: true,
  })),
  on(createChallengeSuccess, (state: ChallengesState) => ({
    ...state,
    createChallengeLoading: false,
    createChallengeSuccess: true,
  })),
  on(createChallengeFailure, (state: ChallengesState, { error }) => ({
    ...state,
    createChallengeLoading: false,
    createChallengeFailure: error,
  }))
);
