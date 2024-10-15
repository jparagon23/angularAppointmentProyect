import {
  saveAvailabilitySuccess,
  saveAvailabilityFailure,
} from './../actions/clubConfiguration.actions';
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ClubConfigurationState } from '../reducers/clubConfiguration.reducers';

// Selecciona el estado de configuración completo
export const selectConfigurationState =
  createFeatureSelector<ClubConfigurationState>('clubConfiguration');

// Selecciona las canchas del estado de configuración
export const selectCourts = createSelector(
  selectConfigurationState,
  (state: ClubConfigurationState) => state.courts
);

// Selecciona el estado de carga de las canchas
export const selectLoadingCourts = createSelector(
  selectConfigurationState,
  (state: ClubConfigurationState) => state.loadingCourts
);

// Selecciona el error de las canchas
export const selectErrorCourts = createSelector(
  selectConfigurationState,
  (state: ClubConfigurationState) => state.errorCourts
);

export const selectCreatingCourtLoading = createSelector(
  selectConfigurationState,
  (state: ClubConfigurationState) => state.creatingCourtLoading
);

export const selectCourtCreated = createSelector(
  selectConfigurationState,
  (state: ClubConfigurationState) => state.courtCreated
);

export const selectCourtCreationError = createSelector(
  selectConfigurationState,
  (state: ClubConfigurationState) => state.errorCreatingCourt
);

// Define the interface for ClubAvailability
export interface ClubAvailabilitySelector {
  alwaysAvailable?: boolean;
  errorAvailability?: string;
  loadingAvailability?: boolean;
  saveAvailabilitySuccess?: boolean;
  saveAvailabilityFailure?: boolean;
  saveAvailabilityLoader?: boolean;
  loadingSaveAvailability?: boolean;
  noAvailability?: boolean;
  byRange?: boolean;
  initialDate?: string;
  endDate?: string;
}

export const selectClubAvailability = createSelector(
  selectConfigurationState,
  (state: ClubConfigurationState): ClubAvailabilitySelector => ({
    saveAvailabilitySuccess: state.saveAvailabilitySuccess ?? undefined,
    saveAvailabilityFailure: state.saveAvailabilityFailure ?? undefined,
    saveAvailabilityLoader: state.saveAvailabilityLoader ?? undefined,
    alwaysAvailable: state.alwaysAvailable ?? undefined,
    errorAvailability: state.errorAvailability ?? undefined,
    loadingAvailability: state.loadingAvailability ?? undefined,
    loadingSaveAvailability: state.saveAvailabilityLoader ?? undefined,
    noAvailability: state.noAvailability ?? undefined,
    byRange: state.byRange ?? undefined,
    initialDate: state.initialAvailableDate ?? undefined,
    endDate: state.endAvailableDate ?? undefined,
  })
);
