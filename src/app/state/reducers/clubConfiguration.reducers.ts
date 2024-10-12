import { createReducer, on } from '@ngrx/store';
import { CourtDetail } from 'src/app/models/CourtDetail.model';
import {
  loadCourts,
  loadCourtsFailure,
  loadCourtsSuccess,
  createCourt,
  createCourtSuccess,
  createCourtFailure,
} from '../actions/clubConfiguration.actions';

export interface ClubConfigurationState {
  courts: CourtDetail[];
  loadingCourts: boolean;
  errorCourts: any;
  creatingCourtLoading: boolean;
  courtCreated: boolean;
  errorCreatingCourt: any;
  // Agrega más estados de carga y error según sea necesario
}

export const initialState: ClubConfigurationState = {
  courts: [],
  loadingCourts: false,
  errorCourts: null,
  creatingCourtLoading: false,
  courtCreated: false,
  errorCreatingCourt: null,
  // Inicializa más estados según sea necesario
};

export const configurationReducer = createReducer(
  initialState,
  on(loadCourts, (state) => ({
    ...state,
    loadingCourts: true,
    errorCourts: null,
  })),
  on(loadCourtsSuccess, (state, { courts }) => ({
    ...state,
    courts,
    loadingCourts: false,
  })),
  on(loadCourtsFailure, (state, { error }) => ({
    ...state,
    errorCourts: error,
    loadingCourts: false,
  })),
  on(createCourt, (state) => ({
    ...state,
    creatingCourtLoading: true,
    errorCreatingCourt: null,
    courtCreated: false,
  })),
  on(createCourtSuccess, (state) => ({
    ...state,
    creatingCourtLoading: false,
    courtCreated: true,
  })),
  on(createCourtFailure, (state, { error }) => ({
    ...state,
    errorCreatingCourt: error,
    creatingCourtLoading: false,
    courtCreated: false,
  }))
);
