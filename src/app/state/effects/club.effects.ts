import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  createReservationAdmin,
  createReservationAdminSuccess,
  getClubUserByNameOrId,
  getClubUserByNameOrIdFailure,
  getClubUserByNameOrIdSuccess,
} from '../actions/club.actions';
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { ReservationService } from 'src/app/services/reservation.service';
import { loadReservationsAdmin } from '../actions/reservations.actions';
import { selectDatePicked } from '../selectors/reservetions.selectors';
import { Store } from '@ngrx/store';
import { closeModal } from '../actions/modals.actions';

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

  createReservationAdmin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createReservationAdmin),
      withLatestFrom(this.store.select(selectDatePicked)),
      switchMap(([action, selectDatePicked]) =>
        this.reservationService
          .createReservationAdmin(action.selecteDates, action.userId)
          .pipe(
            map(() => createReservationAdminSuccess()),
            switchMap(() => [
              loadReservationsAdmin({ date: selectDatePicked }),
              closeModal({ modalId: 'createReservationModal' }),
            ]),
            catchError((error) => of(getClubUserByNameOrIdFailure({ error })))
          )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private userService: UserService,
    private reservationService: ReservationService,
    private store: Store<any>
  ) {}
}
