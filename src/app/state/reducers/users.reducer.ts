import { createReducer, on } from '@ngrx/store';
import { UserState } from 'src/app/models/user.state';
import {
  loadUser,
  loadUserFailure,
  loadUserSuccess,
} from '../actions/users.actions';

export const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
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
  }))
);
