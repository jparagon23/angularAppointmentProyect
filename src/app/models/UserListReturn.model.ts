import { LightUser } from './LightUser.model';

export interface UserListReturn {
  userId: string;
  lightUser: LightUser | null;
}
