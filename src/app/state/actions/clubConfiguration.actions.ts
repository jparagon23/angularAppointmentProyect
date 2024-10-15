import { createAction, props } from '@ngrx/store';
import { ClubAvailability } from 'src/app/models/ClubAvalability.model';
import { CourtDetail } from 'src/app/models/CourtDetail.model';
import { CreateCourt } from 'src/app/models/CreateCourt.model';
import { HttpErrorResponse } from 'src/app/models/httpErrorResponse.model';

export const loadCourts = createAction('[Configuration] Load Courts');
export const loadCourtsSuccess = createAction(
  '[Configuration] Load Courts Success',
  props<{ courts: CourtDetail[] }>()
);
export const loadCourtsFailure = createAction(
  '[Configuration] Load Courts Failure',
  props<{ error: any }>()
);

export const createCourt = createAction(
  '[Configuration] Create Club Court',
  props<{ court: CreateCourt }>()
);

export const createCourtSuccess = createAction(
  '[Configuration] Create Club Court Success',
  props<{ id: number }>()
);

export const createCourtFailure = createAction(
  '[Configuration] Create Club Court Failure',
  props<{ error: HttpErrorResponse }>()
);

export const loadAvailability = createAction(
  '[Configuration] Load Availability',
  props<{ clubId: number }>()
);

//----- Availability Actions

export const loadAvailabilitySuccess = createAction(
  '[Configuration] Load Availability Success',
  props<{ availability: any }>()
);

export const loadAvailabilityFailure = createAction(
  '[Configuration] Load Availability Failure',
  props<{ error: any }>()
);

export const saveAvailability = createAction(
  '[Configuration] Save Availability',
  props<{ availability: ClubAvailability }>()
);

export const saveAvailabilitySuccess = createAction(
  '[Configuration] Save Availability Success',
  props<{ availability: ClubAvailability }>()
);

export const saveAvailabilityFailure = createAction(
  '[Configuration] Save Availability Failure',
  props<{ error: any }>()
);

export const resetClubConfigurationState = createAction(
  '[Configuration] Reset State'
);
