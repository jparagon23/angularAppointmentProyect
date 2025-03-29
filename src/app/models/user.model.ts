export interface UserPhone {
  id: number;
  phoneType: number;
  phoneNumber: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  lastname: string;
  birthdate: string;
  documentType: number;
  document: string;
  userPhones: UserPhone[];
  gender: string;
  userStatus: number;
  creationDate: string;
  allowNotification: string | boolean;
  role: number;
  userAdminClub: number;
  profileImage: string | null;
  rating: number;
  ratingType: number;
  doublesRating: number;
  doublesRatingType: number;
  userRanking: number;
  lastMatchConfirmed: string;
  lastDoubleMatchConfirmed: string;
  userClubMemberships: ClubMembership[];
}

export interface UserData {
  data: User[];
}

export interface ClubMembership {
  clubId: number;
  status: string;
  registerDate: string;
}
