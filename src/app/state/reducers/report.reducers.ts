import { ClubReportDTO } from 'src/app/models/ClubReport.model';
import {
  loadClubReport,
  loadClubReportFailure,
  loadClubReportSuccess,
} from '../actions/report.actions';
import { createReducer, on } from '@ngrx/store';

export interface ReportState {
  loadingClubReport: boolean; // Estado de carga
  clubReport: ClubReportDTO | null; // Reporte cargado
  clubReportFailure: string | null; // Mensaje de error
}

export const initialState: ReportState = {
  loadingClubReport: false,
  clubReport: null,
  clubReportFailure: null,
};

export const reportReducer = createReducer(
  initialState,
  on(loadClubReport, (state) => ({
    ...state,
    loadingClubReport: true,
    clubReportFailure: null,
  })),
  on(loadClubReportSuccess, (state, { report }) => ({
    ...state,
    loadingClubReport: false,
    clubReport: report,
    clubReportFailure: null,
  })),
  on(loadClubReportFailure, (state, { error }) => ({
    ...state,
    loadingClubReport: false,
    clubReportFailure: error,
  }))
);
