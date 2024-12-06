import { createAction, props } from '@ngrx/store';
import { MatchResultDto } from 'src/app/models/PostResult.model';

export const publishMatchResult = createAction(
  '[Match] Publish Match Result',
  props<{ matchResult: MatchResultDto }>()
);

export const publishMatchResultSuccess = createAction(
  '[Match] Publish Match Result Success'
);

export const publishMatchResultFailure = createAction(
  '[Match] Publish Match Result Failure',
  props<{ error: any }>()
);
