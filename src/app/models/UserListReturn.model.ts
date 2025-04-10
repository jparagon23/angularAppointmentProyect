import { LightUser } from './LightUser.model';
import { ClubMembership } from './user.model';

export interface UserListReturn {
  userId: string;
  completeName: string;
  profileImage: string;
  lightUser: LightUser | null;
  userClubMemberships: ClubMembership[];
}
