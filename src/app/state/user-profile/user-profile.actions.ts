import { createAction, props } from '@ngrx/store';
import { UserMatch } from 'src/app/models/events/UserMatch.model';
import { UserMatchesStats } from 'src/app/models/events/UserMatchesStats.model';
import { User } from 'src/app/models/user.model';

export const loadUserProfile = createAction(
  '[user-Profile-view] Load Profile',
  props<{ id: number }>()
);

export const loadUserProfileSuccess = createAction(
  '[user-Profile-view] Load Profile Success',
  props<{ userProfile: User }>()
);

export const loadUserProfileFailure = createAction(
  '[user-Profile-view] Load Profile Failure',
  props<{ error: any }>()
);

export const loadUserProfileMatches = createAction(
  '[user-Profile-view] Load Profile Matches',
  props<{ id: string }>()
);

export const loadUserProfileMatchesSuccess = createAction(
  '[user-Profile-view] Load Profile Matches Success',
  props<{ matches: UserMatch[] }>()
);

export const loadUserProfileMatchesFailure = createAction(
  '[user-Profile-view] Load Profile Matches Failure',
  props<{ error: any }>()
);

export const loadUserProfileStats = createAction(
  '[user-Profile-view] Load Profile Stats',
  props<{ id: string }>()
);

export const loadUserProfileStatsSuccess = createAction(
  '[user-Profile-view] Load Profile Stats Success',
  props<{ stats: UserMatchesStats }>()
);

export const loadUserProfileStatsFailure = createAction(
  '[user-Profile-view] Load Profile Stats Failure',
  props<{ error: any }>()
);
