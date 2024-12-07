import { LightUser } from './LightUser.model';

export interface UserListReturn {
  userId: string;
  completeName: string;
  profileImage: string;
  lightUser: LightUser | null;
}
