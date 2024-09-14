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
