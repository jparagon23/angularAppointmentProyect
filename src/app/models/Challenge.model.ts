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
  challengedId: number; // Usuario retado
  challengeDateTime: string; // Fecha y hora en formato ISO
  matchType: MatchType; // SINGLES o DOUBLES
  clubId: number | undefined; // Club donde se jugará el partido
  message?: string; // Mensaje opcional
  customLocation: string | undefined;
  status: ChallengeStatus; // Estado del reto
}
