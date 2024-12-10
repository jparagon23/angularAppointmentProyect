export interface Set {
  setNumber: number;
  winnerGames: number;
  loserGames: number;
  winnerTieBreak: number;
  loserTieBreak: number;
}

export interface UserMatch {
  matchId: number;
  groupName: string | null;
  matchDate: string;
  status: string;
  winnerName: string;
  looserName: string;
  sets: Set[];
}
