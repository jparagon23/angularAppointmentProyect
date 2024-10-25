import { createReducer, on } from '@ngrx/store';
import { UserState } from 'src/app/models/user.state';
import {
  loadUser,
  loadUserFailure,
  loadUserSuccess,
  resertUpdateUserStatus,
  updateUser,
  updateUserFailure,
  updateUserSuccess,
} from '../actions/users.actions';
import { logout } from '../actions/auth.actions';

export const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
  updateUserLoading: false,
  updateUserSuccess: false,
  updateUserFailure: false,
};

export const profileReducer = createReducer(
  initialState,
  on(loadUser, (state) => ({ ...state, loading: true })),
  on(loadUserSuccess, (state, { user }) => ({
    ...state,
    loading: false,
    user: user,
  })),
  on(loadUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(updateUser, (state) => ({
    ...state,
    updateUserLoading: true,
    updateUserSuccess: false,
    updateUserFailure: false,
  })),
  on(updateUserSuccess, (state, { user }) => ({
    ...state,
    updateUserLoading: false,
    updateUserSuccess: true,
    user,
  })),
  on(updateUserFailure, (state, { error }) => ({
    ...state,
    updateUserLoading: false,
    updateUserFailure: true,
    error,
  })),
  on(resertUpdateUserStatus, (state) => ({
    ...state,
    updateUserLoading: false,
    updateUserSuccess: false,
    updateUserFailure: false,
  })),
  on(logout, () => initialState)
);
