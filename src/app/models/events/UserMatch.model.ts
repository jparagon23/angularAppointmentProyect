import { ClubInfo } from '../ClubInfo.model';

export interface User {
  id: number;
  name: string;
  lastname: string;
}

export interface Set {
  setNumber: number | undefined;
  winnerGames: number | undefined;
  loserGames: number | undefined;
  winnerTieBreak: number | undefined;
  loserTieBreak: number | undefined;
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
  club: ClubInfo;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: SortInfo;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface SortInfo {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface UserMatchResponse {
  _embedded: {
    matchResponseDTOList: UserMatch[];
  };
  _links: PaginationLinks;
}

interface PaginationLinks {
  first: Link;
  self: Link;
  next?: Link;
  last: Link;
}
interface Link {
  href: string;
}
