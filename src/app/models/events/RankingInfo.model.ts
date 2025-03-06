export interface RankingInfo {
  position: number;
  image: string;
  userName: string;
  userLastname: string;
  rating: number;
  userId: number;
}

export interface GeneralRanking {
  singleRanking: RankingInfo[];
  doublesRanking: RankingInfo[];
}
