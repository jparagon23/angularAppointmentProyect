import { createAction, props } from '@ngrx/store';
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
