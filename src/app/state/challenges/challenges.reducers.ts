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
  getChallengeRecomendations,
  getChallengeRecomendationsFailure,
  getChallengeRecomendationsSuccess,
  getUserChallenges,
  getUserChallengesFailure,
  getUserChallengesSuccess,
  rejectChallenge,
  rejectChallengeFailure,
  rejectChallengeSuccess,
  resetChallengeModalState,
} from './challenges.actions';
import { ChallengeRecommendation } from 'src/app/models/challenges/ChallengeRecommendation.model';

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

  challengeRecommendations: ChallengeRecommendation[];
  challengeRecommendationsLoading?: boolean;
  challengeRecommendationsError?: any;

  userChallengesError: any;
}

export const initialState: ChallengesState = {
  userChallenges: [],
  userChallengesSuccess: false,
  userChallengesLoading: false,
  userChallengesError: null,
  challengeRecommendations: [],
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
  })),
  on(getChallengeRecomendations, (state: ChallengesState) => ({
    ...state,
    challengeRecommendationsLoading: true,
    challengeRecommendationsError: null,
  })),
  on(
    getChallengeRecomendationsSuccess,
    (state: ChallengesState, { challengeRecommendations }) => ({
      ...state,
      challengeRecommendations: challengeRecommendations,
      challengeRecommendationsLoading: false,
      challengeRecommendationsError: null,
    })
  ),
  on(
    getChallengeRecomendationsFailure,
    (state: ChallengesState, { error }) => ({
      ...state,
      challengeRecommendationsLoading: false,
      challengeRecommendationsError: error,
    })
  ),
  on(resetChallengeModalState, (state: ChallengesState) => ({
    ...state,
    createChallengeLoading: false,
    createChallengeSuccess: false,
    createChallengeFailure: null,
    challengeResultActionLoading: false,
    acceptChallengeSuccess: false,
    acceptChallengeFailure: null,
    rejectChallengeSuccess: false,
    rejectChallengeFailure: null,
    deleteChallengeSuccess: false,
    deleteChallengeFailure: null,
  }))
);
