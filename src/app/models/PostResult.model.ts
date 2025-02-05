export interface SetDto {
  setNumber: number;
  winnerGames: number;
  loserGames: number;
  loserTieBreak: number;
  winnerTieBreak: number;
  winnerId: number;
}

export interface MatchResultDto {
  groupId: number | null;
  matchType: string;
  winnerId: number;
  winner2Id: number | null;
  loser2Id: number | null;
  loserId: number;
  matchDate: string;
  sets: SetDto[];
}
