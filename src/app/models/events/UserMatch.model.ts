export interface User {
  id: number;
  name: string;
  lastname: string;
}

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
  matchType: string;
  matchDate: string;
  status: string;
  winner: User;
  winner2: User;
  loser: User;
  loser2: User;
  sets: Set[];
  pendingConfirmationUsers: number[] | null;
}
