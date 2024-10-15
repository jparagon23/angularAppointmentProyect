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

export const selectClubAvailability = createSelector(
  selectConfigurationState,
  (state: ClubConfigurationState) => ({
    alwaysAvailable: state.alwaysAvailable ?? undefined,
    noAvailability: state.noAvailability ?? undefined,
    byRange: state.byRange ?? undefined,
    initialDate: state.initialAvailableDate ?? undefined,
    endDate: state.endAvailableDate ?? undefined,
  })
);
