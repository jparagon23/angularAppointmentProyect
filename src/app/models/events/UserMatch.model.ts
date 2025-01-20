export interface User {
  id: number;
  name: string;
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
  matchDate: string;
  status: string;
  winner: User;
  looser: User;
  sets: Set[];
  pendingConfirmationUsers: number[] | null;
}
