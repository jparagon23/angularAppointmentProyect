import { createAction, props } from '@ngrx/store';
import { ClubInfo } from 'src/app/models/ClubInfo.model';

export const getActiveClubs = createAction('[membership] Get active Clubs');

export const getActiveClubsSuccess = createAction(
  '[membership] Get active Clubs Success',
  props<{ activeClubs: ClubInfo[] }>() // Use props to define the payload
);

export const getActiveClubsFailure = createAction(
  '[membership] Get active Clubs Failure',
  (error: any) => ({ error })
);
