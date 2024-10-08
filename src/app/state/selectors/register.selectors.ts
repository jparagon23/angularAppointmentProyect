import { createSelector, createFeatureSelector } from '@ngrx/store';
import { RegisterState } from '../reducers/register.reducers';

export const selectAuthState = createFeatureSelector<RegisterState>('auth');

export const selectInitialSignUpData = createSelector(
  selectAuthState,
  (state: RegisterState) => state.initialData
);

export const selectAuthLoading = createSelector(
  selectAuthState,
  (state: RegisterState) => state.loading
);

export const selectEmailAvailable = createSelector(
  selectAuthState,
  (state: RegisterState) => state.emailAvailable
);

export const selectRegisterError = createSelector(
  selectAuthState,
  (state: RegisterState) => state.registerError
);
