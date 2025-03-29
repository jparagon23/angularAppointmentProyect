import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap } from 'rxjs';
import { ClubService } from 'src/app/services/club.service';
import {
  getActiveClubs,
  getActiveClubsFailure,
  getActiveClubsSuccess,
} from './membership.actions';

@Injectable()
export class MembershipEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly clubService: ClubService,
    private readonly store: Store<any>
  ) {}

  getActiveClubs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getActiveClubs),
      switchMap(() =>
        this.clubService.getActiveClubs().pipe(
          map((activeClubs) => getActiveClubsSuccess({ activeClubs })),
          catchError((error) => of(getActiveClubsFailure({ error })))
        )
      )
    )
  );
}
