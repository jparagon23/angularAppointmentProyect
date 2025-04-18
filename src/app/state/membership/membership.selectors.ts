import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { MembershipState } from './membership.reducers';

export const selectMembershipFeature = (state: AppState) => state.membership;

export const selectMembershipClubs = createSelector(
  selectMembershipFeature,
  (state: MembershipState) => ({
    activeClubs: state.activeClubs,
    loadingActiveClubs: state.loadingActiveClubs,
    error: state.error,
  })
);
