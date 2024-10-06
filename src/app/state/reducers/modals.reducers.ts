import { createReducer, on } from '@ngrx/store';
import { closeModal, openModal } from '../actions/modals.actions';
import { logout } from '../actions/auth.actions';

export interface ModalState {
  [modalId: string]: boolean;
}

export const initialState: ModalState = {};

export const modalReducer = createReducer(
  initialState,
  on(openModal, (state, { modalId }) => ({
    ...state,
    [modalId]: true,
  })),
  on(closeModal, (state, { modalId }) => ({
    ...state,
    [modalId]: false,
  })),
  on(logout, (state) => initialState)
);
