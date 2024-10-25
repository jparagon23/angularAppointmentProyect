import { createSelector, createFeatureSelector } from '@ngrx/store';
import { RegisterState } from '../reducers/register.reducers';
import { AppState } from '../app.state';

export const selectAuthState = createFeatureSelector<RegisterState>('auth');

export const selectRegisterFeature = (state: AppState) => state.register;

export const selectInitialSignUpData = createSelector(
  selectRegisterFeature,
  (state: RegisterState) => state.initialData
);

export const selectAuthLoading = createSelector(
  selectRegisterFeature,
  (state: RegisterState) => state.loading
);

export const selectEmailAvailable = createSelector(
  selectRegisterFeature,
  (state: RegisterState) => state.emailAvailable
);

export const selectRegisterError = createSelector(
  selectRegisterFeature,
  (state: RegisterState) => state.registerError
);
