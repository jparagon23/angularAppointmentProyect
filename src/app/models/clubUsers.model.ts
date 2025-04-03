import { ClubMembership } from './user.model';

export interface ClubUser {
  userId: number | null;
  userIdentification: string;
  completeName: string;
  profileImage: string;
  userStatus: number;
  userClubMemberships: ClubMembership[];
}
