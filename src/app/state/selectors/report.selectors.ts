import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ReportState } from '../reducers/report.reducers';

export const selectReportState = createFeatureSelector<ReportState>('report');

// Selector para obtener el reporte completo del club
export const selectClubReport = createSelector(
  selectReportState,
  (state: ReportState) => ({
    loading: state.loadingClubReport,
    report: state.clubReport,
    error: state.clubReportFailure,
  })
);
