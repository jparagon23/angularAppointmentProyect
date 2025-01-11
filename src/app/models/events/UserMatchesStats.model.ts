export interface UserMatchesStats {
  matches: {
    totalPlayed: number;
    won: number;
    lost: number;
    winPercentage: number;
  };
  sets: {
    totalPlayed: number;
    won: number;
    lost: number;
    winPercentage: number;
  };
  frequentRivals: {
    mostFrequent: {
      name: string;
      totalMatches: number;
      won: number;
      lost: number;
    };
    mostWonAgainst: {
      name: string;
      total: number;
    };
    mostLostAgainst: {
      name: string;
      total: number;
    };
  };
}
