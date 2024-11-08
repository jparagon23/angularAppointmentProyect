import { createReducer, on } from '@ngrx/store';
import * as AuthActions from '../actions/register.actions';
import { InitialSignUpData } from 'src/app/models/InitialSignUpData.interface';

export interface RegisterState {
  initialData: InitialSignUpData | null;
  loading: boolean;
  emailAvailable: boolean | null;
  registerError: string | null;
}

export const initialState: RegisterState = {
  initialData: null,
  loading: false,
  emailAvailable: null,
  registerError: null,
};

export const registerReducer = createReducer(
  initialState,
  on(AuthActions.loadInitialSignUpData, (state) => ({
    ...state,
    loading: true,
  })),
  on(AuthActions.loadInitialSignUpDataSuccess, (state, { data }) => ({
    ...state,
    initialData: data,
    loading: false,
  })),
  on(AuthActions.loadInitialSignUpDataFailure, (state) => ({
    ...state,
    loading: false,
  })),
  on(AuthActions.checkEmailAvailability, (state) => ({
    ...state,
    loading: true,
  })),
  on(
    AuthActions.checkEmailAvailabilitySuccess,
    (state, { emailAvailabilityResponse }) => ({
      ...state,
      emailAvailable: emailAvailabilityResponse.creationResponse === 3,
      loading: false,
    })
  ),
  on(AuthActions.checkEmailAvailabilityFailure, (state) => ({
    ...state,
    loading: false,
  })),
  on(AuthActions.registerUser, (state) => ({
    ...state,
    loading: true,
    registerError: null,
  })),
  on(AuthActions.registerUserSuccess, (state) => ({
    ...state,
    loading: false,
  })),
  on(AuthActions.registerUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    registerError: error,
  }))
);
