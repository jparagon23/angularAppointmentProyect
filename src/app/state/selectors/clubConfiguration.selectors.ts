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
