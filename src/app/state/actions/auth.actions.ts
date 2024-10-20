import { createAction, props } from '@ngrx/store';

export const login = createAction(
  '[Auth] Login',
  props<{ email: string; password: string }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ accessToken: string; refreshToken: string }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: any; userId?: string }>()
);

export const resendAuthenticationCode = createAction(
  '[Auth] Resend Authentication Code'
);

export const resendAuthenticationCodeSuccess = createAction(
  '[Auth] Resend Authentication Code Success'
);

export const resendAuthenticationCodeFailure = createAction(
  '[Auth] Resend Authentication Code Failure',
  props<{ error: any }>()
);

export const validateToken = createAction(
  '[Auth] Validate Token',
  props<{ token: string }>()
);

export const validateTokenSuccess = createAction(
  '[Auth] Validate Token Success'
);

export const validateTokenFailure = createAction(
  '[Auth] Validate Token Failure',
  props<{ error: string }>()
);

export const setAuthenticationStatus = createAction(
  '[Auth] Set Authentication Status',
  props<{ isAuthenticated: boolean }>()
);

export const logout = createAction('[Auth] Logout');
