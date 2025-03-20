import { createAction, props } from '@ngrx/store';
import { UserMatch } from 'src/app/models/events/UserMatch.model';

export const getLast10SinglesMatches = createAction(
  '[dashboard] Get Last 10 Matches'
);
export const getLast10SinglesMatchesSuccess = createAction(
  '[dashboard] Get Last 10 Matches Success',
  props<{ matches: UserMatch[] }>()
);
export const getLast10SinglesMatchesFailure = createAction(
  '[dashboard] Get Last 10 Matches Failure',
  props<{ error: any }>()
);

export const getLast10DoublesMatches = createAction(
  '[dashboard] Get Last 10 Doubles Matches'
);
export const getLast10DoublesMatchesSuccess = createAction(
  '[dashboard] Get Last 10 Doubles Matches Success',
  props<{ matches: UserMatch[] }>()
);
export const getLast10DoublesMatchesFailure = createAction(
  '[dashboard] Get Last 10 Doubles Matches Failure',
  props<{ error: any }>()
);
