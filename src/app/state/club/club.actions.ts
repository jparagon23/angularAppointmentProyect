import { createAction, props } from '@ngrx/store';
import { ClubUser } from 'src/app/models/clubUsers.model';
import { CreateReservationAdmin } from 'src/app/models/createReservationAdmin.model';
import { UpdateReservationDto } from 'src/app/models/UpdateReservationDto.model';
import { UserMatch } from 'src/app/models/events/UserMatch.model';
import { GeneralRanking } from 'src/app/models/events/RankingInfo.model';

export const getClubUserByNameOrId = createAction(
  '[Admin Dashboard] Get User By Name Or Id',
  props<{ nameOrId: string }>()
);

export const getClubUserByNameOrIdSuccess = createAction(
  '[Admin Dashboard] Get User By Name Or Id Success',
  props<{ users: ClubUser[] }>()
);

export const getClubUserByNameOrIdFailure = createAction(
  '[Admin Dashboard] Get User By Name Or Id Failure',
  props<{ error: any }>()
);

export const createReservationAdmin = createAction(
  '[Admin Dashboard] Create Reservation',
  props<{
    createReservationAdminDto: CreateReservationAdmin;
  }>()
);

export const createReservationAdminSuccess = createAction(
  '[Admin Dashboard] Create Reservation Success'
);

export const createReservationAdminFailure = createAction(
  '[Admin Dashboard] Create Reservation Failure',
  props<{ error: any }>()
);

export const resetReservationCreated = createAction(
  '[Club] Reset Reservation Created'
);

export const resetClubUsers = createAction('[Club] Reset Club Users');

export const selectedClubDate = createAction(
  '[Admin Dashboard] Selected Club Date',
  props<{ date: string }>()
);

export const updateReservationAdmin = createAction(
  '[Admin Dashboard] Update Reservation',
  props<{
    updateReservationAdminDto: UpdateReservationDto;
    selectedDate: string;
  }>()
);

export const updateReservationAdminSuccess = createAction(
  '[Admin Dashboard] Update Reservation Success',
  props<{ selectedDate: string }>()
);

export const updateReservationAdminFailure = createAction(
  '[Admin Dashboard] Update Reservation Failure',
  props<{ error: any }>()
);

// -------------------------------------------------club-page actions----------------------------------------------------
export const loadLast10ClubMatches = createAction(
  '[Club Page] Load Last 10 Club Matches',
  props<{ clubId: number }>()
);
export const loadLast10ClubMatchesSuccess = createAction(
  '[Club Page] Load Last 10 Club Matches Success',
  props<{ matches: UserMatch[] }>()
);
export const loadLast10ClubMatchesFailure = createAction(
  '[Club Page] Load Last 10 Club Matches Failure',
  props<{ error: any }>()
);

export const loadClubRanking = createAction(
  '[Club Page] Load Club Ranking',
  props<{ clubId: number }>()
);

export const loadClubRankingSuccess = createAction(
  '[Club Page] Load Club Ranking Success',
  props<{ ranking: GeneralRanking }>()
);

export const loadClubRankingFailure = createAction(
  '[Club Page] Load Club Ranking Failure',
  props<{ error: any }>()
);
// -----------------------------------------------------------------------------------------------------
