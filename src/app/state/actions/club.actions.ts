import { update } from 'lodash';
import { LightUser } from 'src/app/models/LightUser.model';
import { createAction, props } from '@ngrx/store';
import { ClubUser } from 'src/app/models/clubUsers.model';
import { CreateReservationAdmin } from 'src/app/models/createReservationAdmin.model';
import { UpdateReservationDto } from 'src/app/models/UpdateReservationDto.model';

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
