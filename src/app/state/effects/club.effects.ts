import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  createReservationAdmin,
  createReservationAdminFailure,
  createReservationAdminSuccess,
  getClubUserByNameOrId,
  getClubUserByNameOrIdFailure,
  getClubUserByNameOrIdSuccess,
  updateReservationAdmin,
  updateReservationAdminFailure,
  updateReservationAdminSuccess,
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
      switchMap(({ createReservationAdminDto }) =>
        this.reservationService
          .createReservationAdmin(createReservationAdminDto)
          .pipe(
            // Si la creación de la reserva es exitosa, solo lanzamos `createReservationAdminSuccess`
            map(() => createReservationAdminSuccess()),
            catchError((error) => of(createReservationAdminFailure({ error })))
          )
      )
    )
  );

  loadReservationsAndCloseModal$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createReservationAdminSuccess), // Escuchar cuando la reserva se creó correctamente
      withLatestFrom(this.store.select(selectDatePicked)), // Obtenemos la fecha seleccionada
      switchMap(([_, selectDatePicked]) => [
        loadReservationsAdmin({ date: selectDatePicked }), // Cargamos las reservas
        closeModal({ modalId: 'createReservationFromTableModal' }), // Cerramos el modal
      ])
    )
  );

  updateReservation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateReservationAdmin),
      switchMap(({ updateReservationAdminDto, selectedDate }) =>
        this.reservationService
          .updateReservationAdmin(updateReservationAdminDto)
          .pipe(
            map(() => updateReservationAdminSuccess({ selectedDate })), // Pasa selectedDate al éxito
            catchError(
              (error) => of(updateReservationAdminFailure({ error })) // Maneja errores
            )
          )
      )
    )
  );

  afterUpdateReservationSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateReservationAdminSuccess),
      map(({ selectedDate }) => {
        // Usa selectedDate para cargar reservas después del éxito
        return loadReservationsAdmin({ date: selectedDate });
      })
    )
  );

  onFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(createReservationAdminFailure),
        map(() => {
          console.error('Failed to create reservation');
        })
      ),
    { dispatch: false }
  );

  constructor(
    private readonly actions$: Actions,
    private readonly userService: UserService,
    private readonly reservationService: ReservationService,
    private readonly store: Store<any>
  ) {}
}
