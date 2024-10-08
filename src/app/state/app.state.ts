import { reservationsReducer } from './reducers/reservations.reducers';
import { ActionReducerMap } from '@ngrx/store';
import { ReservationState } from '../models/reservations.state';
import { UserState } from '../models/user.state';
import { profileReducer } from './reducers/users.reducer';
import { authReducer, AuthState } from './reducers/auth.reducers';
import { clubReducer, ClubState } from './reducers/club.reducers';
import { modalReducer, ModalState } from './reducers/modals.reducers';
import { RegisterState, registerReducer } from './reducers/register.reducers';

export interface AppState {
  user: UserState;
  reservations: ReservationState;
  auth: AuthState;
  club: ClubState;
  modals: ModalState;
  register: RegisterState;
}

export const ROOT_REDUCERS: ActionReducerMap<AppState> = {
  user: profileReducer,
  reservations: reservationsReducer,
  auth: authReducer,
  club: clubReducer,
  modals: modalReducer,
  register: registerReducer,
};
