import { ClubUser } from 'src/app/models/clubUsers.model';
import {
  getClubUserByNameOrId,
  getClubUserByNameOrIdSuccess,
  getClubUserByNameOrIdFailure,
} from '../actions/club.actions';
import { createReducer, on } from '@ngrx/store';
export interface clubState {
  clubUsers: ClubUser[];
  loadingClubUsers: boolean;
  error: any;
}

export const initialState: clubState = {
  clubUsers: [],
  loadingClubUsers: false,
  error: null,
};

export const clubReducer = createReducer(
  initialState,
  on(getClubUserByNameOrId, (state: clubState) => ({
    ...state,
    loadingClubUsers: true,
  })),
  on(getClubUserByNameOrIdSuccess, (state: clubState, { users }) => ({
    ...state,
    clubUsers: users,
    loadingClubUsers: false,
  })),
  on(getClubUserByNameOrIdFailure, (state: clubState, { error }) => ({
    ...state,
    loadingClubUsers: false,
    error,
  }))
);
