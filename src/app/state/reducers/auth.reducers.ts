import { createReducer, on } from '@ngrx/store';
import {
  login,
  loginFailure,
  loginSuccess,
  logout,
  setAuthenticationStatus,
  validateToken,
  validateTokenFailure,
  validateTokenSuccess,
} from '../actions/auth.actions';

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  error: any;
  loading: boolean;
  tokenLoading: boolean;
  accountIsAuthenticated: boolean;
}

export const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  error: null,
  loading: false,
  accountIsAuthenticated: false,
  tokenLoading: false,
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
  on(logout, () => initialState),
  on(validateToken, (state) => ({
    ...state,
    tokenLoading: true,
    error: null,
  })),
  on(validateTokenSuccess, (state) => ({
    ...state,
    tokenLoading: false,
    accountIsAuthenticated: true,
    error: null,
  })),
  on(validateTokenFailure, (state, { error }) => ({
    ...state,
    tokenLoading: false,
    accountIsAuthenticated: false,
    error,
  })),
  on(setAuthenticationStatus, (state, { isAuthenticated }) => ({
    ...state,
    accountIsAuthenticated: isAuthenticated,
  }))
);
