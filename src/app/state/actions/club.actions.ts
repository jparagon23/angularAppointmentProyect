import { createAction, props } from '@ngrx/store';
import { ClubUser } from 'src/app/models/clubUsers.model';

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
  props<{ selecteDates: string[]; userId: string }>()
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
