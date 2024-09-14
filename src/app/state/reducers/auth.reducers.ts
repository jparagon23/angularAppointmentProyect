import { createReducer, on } from '@ngrx/store';
import {
  login,
  loginFailure,
  loginSuccess,
  logout,
} from '../actions/auth.actions';

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  error: any;
  loading: boolean;
}

export const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  error: null,
  loading: false,
};

export const authReducer = createReducer(
  initialState,
  on(login, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(loginSuccess, (state, { accessToken, refreshToken }) => ({
    ...state,
    accessToken,
    refreshToken,
    loading: false,
  })),
  on(loginFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(logout, (state) => ({
    ...state,
    accessToken: null,
    refreshToken: null,
    error: null,
    loading: false,
  }))
);
