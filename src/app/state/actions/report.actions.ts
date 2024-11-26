import { createAction, props } from '@ngrx/store';
import { ClubReportDTO } from 'src/app/models/ClubReport.model';

export const loadClubReport = createAction(
  '[Club Reports] Load Club Report',
  props<{ initialDate: string; endDate: string }>()
);

export const loadClubReportSuccess = createAction(
  '[Club Reports] Load Club Report Success',
  props<{ report: ClubReportDTO }>()
);

export const loadClubReportFailure = createAction(
  '[Club Reports] Load Club Report Failure',
  props<{ error: any }>()
);
