import { createAction, props } from '@ngrx/store';
import { User } from 'src/app/models/user.model';

export const loadUser = createAction('[Profile] Load Profile');
export const loadUserSuccess = createAction(
  '[Profile] Load Profile Success',
  props<{ user: User }>()
);
export const loadUserFailure = createAction(
  '[Profile] Load Profile Failure',
  props<{ error: any }>()
);

export const updateUser = createAction(
  '[Profile] Update Profile',
  props<{ user: Partial<User> }>()
);

export const updateStoreUser = createAction(
  '[Profile] Update Store User',
  props<{ user: User }>()
);

export const updateUserSuccess = createAction(
  '[Profile] Update Profile Success',
  props<{ user: User }>()
);

export const updateUserFailure = createAction(
  '[Profile] Update Profile Failure',
  props<{ error: any }>()
);

export const resertUpdateUserStatus = createAction(
  '[Profile] Reset Update User Status'
);
