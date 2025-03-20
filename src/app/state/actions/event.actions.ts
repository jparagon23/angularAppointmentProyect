import { createAction, props } from '@ngrx/store';
import {
  GeneralRanking,
  RankingInfo,
} from 'src/app/models/events/RankingInfo.model';
import {
  UserMatch,
  UserMatchResponse,
} from 'src/app/models/events/UserMatch.model';
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

export const getUserMatches = createAction(
  '[dashboard] Get User Matches',
  props<{ matchtype: string; page: number; size: number }>()
);

export const getUserMatchesSuccess = createAction(
  '[dashboard] Get User Matches Success',
  props<{ matches: UserMatchResponse }>() // Maneja la respuesta paginada
);

export const getUserMatchesFailure = createAction(
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
  '[matches-stats-page] Get User Matches Stats',
  props<{ matchType: string }>()
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

export const getRanking = createAction('[dashboard] Get Ranking');
export const getRankingSuccess = createAction(
  '[dashboard] Get Ranking Success',
  props<{ ranking: GeneralRanking }>()
);
export const getRankingFailure = createAction(
  '[dashboard] Get Ranking Failure',
  props<{ error: any }>()
);

// Acción para solicitar los partidos (inicio de la carga)
export const loadAdminPostedMatches = createAction(
  '[admin-dashboard] Load Posted Matches'
);

// Acción para cargar los partidos exitosamente
export const loadAdminPostedMatchesSuccess = createAction(
  '[admin-dashboard] Load Posted MatchesSuccess',
  props<{ matches: UserMatch[] }>()
);

// Acción en caso de error al cargar los partidos
export const loadAdminPostedMatchesFailure = createAction(
  '[admin-dashboard] Load Posted Matches Failure',
  props<{ error: any }>()
);
