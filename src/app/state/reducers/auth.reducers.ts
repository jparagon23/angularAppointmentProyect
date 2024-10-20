import { createReducer, on } from '@ngrx/store';
import {
  login,
  loginFailure,
  loginSuccess,
  logout,
  resendAuthenticationCode,
  resendAuthenticationCodeFailure,
  resendAuthenticationCodeSuccess,
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
  resentCode: boolean;
}

export const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  error: null,
  loading: false,
  accountIsAuthenticated: false,
  tokenLoading: false,
  resentCode: false,
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
  })),
  on(resendAuthenticationCode, (state) => ({
    ...state,
    resentCode: false,
  })),
  on(resendAuthenticationCodeSuccess, (state) => ({
    ...state,
    resentCode: true,
  })),
  on(resendAuthenticationCodeFailure, (state) => ({
    ...state,
    resentCode: false,
  }))
);
