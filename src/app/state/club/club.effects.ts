import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  createReservationAdmin,
  createReservationAdminFailure,
  createReservationAdminSuccess,
  getClubUserByNameOrId,
  getClubUserByNameOrIdFailure,
  getClubUserByNameOrIdSuccess,
  loadClubRanking,
  loadClubRankingFailure,
  loadClubRankingSuccess,
  loadLast10ClubMatches,
  loadLast10ClubMatchesFailure,
  loadLast10ClubMatchesSuccess,
  updateReservationAdmin,
  updateReservationAdminFailure,
  updateReservationAdminSuccess,
} from './club.actions';
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { ReservationService } from 'src/app/services/reservation.service';
import { loadReservationsAdmin } from '../actions/reservations.actions';
import { selectDatePicked } from '../selectors/reservetions.selectors';
import { Store } from '@ngrx/store';
import { closeModal } from '../actions/modals.actions';
import { ClubService } from 'src/app/services/club.service';
import { MatchService } from 'src/app/services/match.service';
import { StatisticsService } from 'src/app/services/statistics.service';

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

  loadLastClubMatches$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadLast10ClubMatches),
      switchMap(({ clubId }) =>
        this.matchService.getClubMatches(clubId, 'ALL').pipe(
          map((matches) =>
            loadLast10ClubMatchesSuccess({
              matches: matches._embedded?.matchResponseDTOList ?? [],
            })
          ),
          catchError((error) => of(loadLast10ClubMatchesFailure({ error })))
        )
      )
    )
  );

  loadClubRanking$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadClubRanking),
      switchMap(({ clubId }) =>
        this.statisticsService.getClubRanking(clubId).pipe(
          map((ranking) => loadClubRankingSuccess({ ranking })),
          catchError((error) => of(loadClubRankingFailure({ error })))
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
    private readonly clubService: ClubService,
    private readonly reservationService: ReservationService,
    private readonly matchService: MatchService,
    private readonly statisticsService: StatisticsService,
    private readonly store: Store<any>
  ) {}
}
