import { User } from './user.model';

export interface UserState {
  user: User | null;
  loading: boolean;
  error: any;
  updateUserLoading: boolean;
  updateUserSuccess: boolean;
  updateUserFailure: boolean;
}
