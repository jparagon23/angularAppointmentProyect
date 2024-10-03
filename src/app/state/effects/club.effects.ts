import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  getClubUserByNameOrId,
  getClubUserByNameOrIdFailure,
  getClubUserByNameOrIdSuccess,
} from '../actions/club.actions';
import { catchError, map, of, switchMap } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Injectable()
export class ClubEffects {
  getClubUserByNameOrId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getClubUserByNameOrId),
      switchMap((action) =>
        this.userService.getClubUserByNameOrId(action.nameOrId).pipe(
          map((users) => getClubUserByNameOrIdSuccess({ users })),
          catchError((error) => of(getClubUserByNameOrIdFailure({ error })))
        )
      )
    )
  );

  constructor(private actions$: Actions, private userService: UserService) {}
}
