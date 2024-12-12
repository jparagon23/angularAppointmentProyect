import { createAction, props } from '@ngrx/store';
import { UserMatch } from 'src/app/models/events/UserMatch.model';
import { MatchResultDto } from 'src/app/models/PostResult.model';

export const publishMatchResult = createAction(
  '[Post-score-modal] Publish Match Result',
  props<{ matchResult: MatchResultDto }>()
);

export const publishMatchResultSuccess = createAction(
  '[Post-score-modal] Publish Match Result Success'
);

export const publishMatchResultFailure = createAction(
  '[Post-score-modal] Publish Match Result Failure',
  props<{ error: any }>()
);

export const resetPostScoreStatus = createAction(
  '[Post-score-modal] Reset Post Score Status'
);

export const getUserMatches = createAction('[dashboard] Get User Matches');

export const getUserMathcesSuccess = createAction(
  '[dashboard] Get User Matches Success',
  props<{ matches: UserMatch[] }>()
);
export const getUserMathcesFailure = createAction(
  '[dashboard] Get User Matches Failure',
  props<{ error: any }>()
);

export const confirmMatchResult = createAction(
  '[Post-score-modal] Confirm Match Result',
  props<{ matchId: number }>()
);

export const confirmMatchResultSuccess = createAction(
  '[Post-score-modal] Confirm Match Result Success'
);

export const confirmMatchResultFailure = createAction(
  '[Post-score-modal] Confirm Match Result Failure',
  props<{ error: any }>()
);

export const rejectMatchResult = createAction(
  '[Post-score-modal] Reject Match Result',
  props<{ matchId: number }>()
);

export const rejectMatchResultSuccess = createAction(
  '[Post-score-modal] Reject Match Result Success'
);

export const rejectMatchResultFailure = createAction(
  '[Post-score-modal] Reject Match Result Failure',
  props<{ error: any }>()
);

export const resetMatchResultState = createAction(
  '[Post-score-modal] Reset Match Result State'
);
