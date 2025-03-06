export interface MatchHistory {
  date: string; // Asegura que venga como "YYYY-MM-DD" desde Java
  rivalRating: number;
  userRating: number;
  won: boolean;
  rivalName: string;
  result: string;
}

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
  matchHistory: MatchHistory[]; // ✅ Agregado para coincidir con Java
}
