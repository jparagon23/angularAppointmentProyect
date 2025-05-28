export interface ChallengePageResponse {
  content: ChallengeResponseDTO[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number; // página actual (empezando en 0)
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface ChallengeResponseDTO {
  id: number;
  challenger: PublicUserSummaryDTO;
  challenged: PublicUserSummaryDTO;
  challengeDateTime: string;
  matchType: 'SINGLES' | 'DOUBLES';
  pendingConfirmationUsers: number[];
  club: ClubSummaryDTO;
  customLocation: string | null;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
  message: string | null;
  respondedAt: string | null;
}

export interface PublicUserSummaryDTO {
  id: number;
  name: string;
  lastname: string;
  profileImage: string | null;
  rating: number;
}

export interface ClubSummaryDTO {
  id: number;
  name: string;
  description: string;
  location: string;
  city: string;
  country: string;
  phone: string;
  email: string | null;
  clubLogo: string; // imagen codificada en base64
}
