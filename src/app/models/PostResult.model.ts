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
  winnerId: number;
  loserId: number;
  matchDate: string;
  sets: SetDto[];
}
