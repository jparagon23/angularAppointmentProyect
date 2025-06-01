import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, switchMap, withLatestFrom } from 'rxjs';
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
} from './challenges.actions';
import { ChallengeService } from 'src/app/services/challenge.service';
import { get } from 'lodash';

@Injectable()
export class ChallengesEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly challengeService: ChallengeService
  ) {
    // Initialize any services or dependencies here
  }

  getUserChallenges$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getUserChallenges),
      switchMap((action) =>
        this.challengeService
          .getUserChallenges(
            action.userId,
            action.matchType,
            action.challengeStatus,
            action.page ?? 0,
            action.size ?? 10,
            action.sortBy ?? 'challengeDateTime',
            action.sortDir ?? 'desc'
          )
          .pipe(
            map((response) =>
              getUserChallengesSuccess({ userChallenges: response.content })
            ),
            catchError((error) => of(getUserChallengesFailure({ error })))
          )
      )
    )
  );

  acceptChallenge$ = createEffect(() =>
    this.actions$.pipe(
      ofType(acceptChallenge),
      switchMap(({ challengeId }) =>
        this.challengeService.acceptChallenge(challengeId).pipe(
          map(() => acceptChallengeSuccess()),
          catchError((error) => of(acceptChallengeFailure({ error })))
        )
      )
    )
  );

  rejectChallenge$ = createEffect(() =>
    this.actions$.pipe(
      ofType(rejectChallenge),
      switchMap(({ challengeId }) =>
        this.challengeService.rejectChallenge(challengeId).pipe(
          map(() => rejectChallengeSuccess()),
          catchError((error) => of(rejectChallengeFailure({ error })))
        )
      )
    )
  );

  deleteChallenge$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteChallenge),
      switchMap(({ challengeId }) =>
        this.challengeService.deleteChallenge(challengeId).pipe(
          map(() => deleteChallengeSuccess()),
          catchError((error) => of(deleteChallengeFailure({ error })))
        )
      )
    )
  );

  loadChellengerAfterChallengeResultAction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        acceptChallengeSuccess,
        rejectChallengeSuccess,
        deleteChallengeSuccess,
        createChallengeSuccess
      ),
      mergeMap(() => [
        getUserChallenges({ challengeStatus: ['PENDING', 'ACCEPTED'] }),
      ])
    )
  );

  createChallenge$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createChallenge),
      switchMap(({ challenge }) =>
        this.challengeService.createChallenge(challenge).pipe(
          map(() => createChallengeSuccess()),
          catchError((error) => of(createChallengeFailure({ error })))
        )
      )
    )
  );

  getChallengeRecommendations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getChallengeRecomendations),
      switchMap((userId) =>
        this.challengeService.getChallengeRecommendations(userId.userId).pipe(
          map((response) =>
            getChallengeRecomendationsSuccess({
              challengeRecommendations: response,
            })
          ),
          catchError((error) =>
            of(getChallengeRecomendationsFailure({ error }))
          )
        )
      )
    )
  );
}
