import { createAction, props } from '@ngrx/store';
import { UserMatch } from 'src/app/models/events/UserMatch.model';
import { UserMatchesStats } from 'src/app/models/events/UserMatchesStats.model';
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

export const deleteMatchResult = createAction(
  '[Match-result-card] Delete Match Result',
  props<{ matchId: number }>()
);

export const deleteMatchResultSuccess = createAction(
  '[Match-result-card] Delete Match Result Success'
);

export const deleteMatchResultFailure = createAction(
  '[Match-result-card] Delete Match Result Failure',
  props<{ error: any }>()
);

export const getMatchById = createAction(
  '[Match-action-modal] Get Match By Id',
  props<{ matchId: string }>()
);

///USER MATCHES STATS
export const getUserMatchesStats = createAction(
  '[matches-stats-page] Get User Matches Stats'
);

export const getUserMatchesStatsSuccess = createAction(
  '[matches-stats-page] Get User Matches Stats Success',
  props<{ stats: UserMatchesStats }>()
);

export const getUserMatchesStatsFailure = createAction(
  '[matches-stats-page] Get User Matches Stats Failure',
  props<{ error: any }>()
);

export const resetUserMatchesStatsState = createAction(
  '[matches-stats-page] Reset User Matches Stats State'
);
