export enum MatchType {
    SINGLES = 'SINGLES',
    DOUBLES = 'DOUBLES',
  }
  
  export enum ChallengeStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
    CANCELLED = 'CANCELLED',
  }
  
  // Interfaz del reto
  export interface Challenge {
    id?: number;
    challengerId: number; // Usuario que envió el reto
    opponentId: number; // Usuario retado
    clubId: number; // Club donde se jugará el partido
    matchDate: string; // Fecha y hora en formato ISO
    matchType: MatchType; // SINGLES o DOUBLES
    message?: string; // Mensaje opcional
    status: ChallengeStatus; // Estado del reto
  }
  
  