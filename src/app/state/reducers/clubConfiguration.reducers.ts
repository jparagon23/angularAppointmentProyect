import {
  loadAvailability,
  loadAvailabilityFailure,
  saveAvailability,
  saveAvailabilityFailure,
} from 'src/app/state/actions/clubConfiguration.actions';
import { createReducer, on } from '@ngrx/store';
import { CourtDetail } from 'src/app/models/CourtDetail.model';
import {
  loadCourts,
  loadCourtsFailure,
  loadCourtsSuccess,
  createCourt,
  createCourtSuccess,
  createCourtFailure,
  resetClubConfigurationState,
  loadAvailabilitySuccess,
  saveAvailabilitySuccess,
} from '../actions/clubConfiguration.actions';

export interface ClubConfigurationState {
  courts: CourtDetail[];
  loadingCourts: boolean;
  errorCourts: any;
  creatingCourtLoading: boolean;
  courtCreated: boolean;
  errorCreatingCourt: any;
  // availability
  loadingAvailability: boolean;
  loadingSaveAvailability: boolean;
  errorAvailability: any;
  alwaysAvailable: boolean | null;
  noAvailability: boolean | null;
  byRange: boolean | null;
  initialAvailableDate: string | null;
  endAvailableDate: string | null;
  //
}

export const initialState: ClubConfigurationState = {
  courts: [],
  loadingCourts: false,
  errorCourts: null,
  creatingCourtLoading: false,
  courtCreated: false,
  errorCreatingCourt: null,
  // availability
  errorAvailability: null,
  loadingAvailability: false,
  loadingSaveAvailability: false,
  alwaysAvailable: null,
  noAvailability: null,
  initialAvailableDate: null,
  endAvailableDate: null,
  byRange: null,
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
  })),
  on(loadAvailability, (state) => ({
    ...state,
    loadingAvailability: true,
  })),
  on(loadAvailabilitySuccess, (state, { availability }) => ({
    ...state,
    alwaysAvailable: availability.alwaysAvailable ?? null,
    noAvailability: availability.noAvailability ?? null,
    byRange: availability.byRange ?? null,
    initialAvailableDate: availability.initialDate ?? null,
    endAvailableDate: availability.endDate ?? null,
  })),
  on(loadAvailabilityFailure, (state, { error }) => ({
    ...state,
    loadingAvailability: false,
    errorAvailability: error,
  })),
  on(saveAvailability, (state) => ({
    ...state,
    loadingSaveAvailability: true,
  })),
  on(saveAvailabilitySuccess, (state, { availability }) => ({
    ...state,
    alwaysAvailable: availability.alwaysAvailable ?? null,
    noAvailability: availability.noAvailability ?? null,
    byRange: availability.byRange ?? null,
    initialAvailableDate: availability.initialDate ?? null,
    endAvailableDate: availability.endDate ?? null,
  })),
  on(saveAvailabilityFailure, (state, { error }) => ({
    ...state,
    loadingSaveAvailability: false,
    errorAvailability: error,
  })),

  on(resetClubConfigurationState, () => initialState)
);
