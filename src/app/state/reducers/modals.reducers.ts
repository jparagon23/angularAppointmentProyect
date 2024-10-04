import { createReducer, on } from '@ngrx/store';
import { closeModal, openModal } from '../actions/modals.actions';

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
  }))
);
