import { createReducer, on } from '@ngrx/store';
import { ClubInfo } from 'src/app/models/ClubInfo.model';
import {
  getActiveClubs,
  getActiveClubsFailure,
  getActiveClubsSuccess,
} from './membership.actions';

export interface MembershipState {
  activeClubs: ClubInfo[];
  loadingActiveClubs: boolean;
  error: any;
}

export const initialState: MembershipState = {
  activeClubs: [],
  loadingActiveClubs: false,
  error: null,
};

export const membershipReducer = createReducer(
  initialState,
  on(getActiveClubs, (state) => ({
    ...state,
    loadingActiveClubs: true,
  })),
  on(getActiveClubsSuccess, (state, { activeClubs }) => ({
    ...state,
    activeClubs: activeClubs,
    loadingActiveClubs: false,
  })),
  on(getActiveClubsFailure, (state, { error }) => ({
    ...state,
    loadingActiveClubs: false,
    error,
  }))
);
