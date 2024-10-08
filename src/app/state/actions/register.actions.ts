import { createAction, props } from '@ngrx/store';
import { InitialSignUpData } from 'src/app/models/InitialSignUpData.interface';

export const loadInitialSignUpData = createAction(
  '[register component] Load Initial SignUp Data'
);
export const loadInitialSignUpDataSuccess = createAction(
  '[register effect] Load Initial SignUp Data Success',
  props<{ data: InitialSignUpData }>()
);
export const loadInitialSignUpDataFailure = createAction(
  '[register component effect] Load Initial SignUp Data Failure'
);

export const checkEmailAvailability = createAction(
  '[register component] Check Email Availability',
  props<{ email: string }>()
);
export const checkEmailAvailabilitySuccess = createAction(
  '[register component effect] Check Email Availability Success',
  props<{ available: boolean }>()
);
export const checkEmailAvailabilityFailure = createAction(
  '[register component effect]] Check Email Availability Failure'
);

export const registerUser = createAction(
  '[register component] Register User',
  props<{ formData: any }>()
);
export const registerUserSuccess = createAction(
  '[register component effect] Register User Success'
);
export const registerUserFailure = createAction(
  '[register effect] Register User Failure',
  props<{ error: string }>()
);
