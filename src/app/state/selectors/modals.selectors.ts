import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ModalState } from '../reducers/modals.reducers';

export const selectModalState = createFeatureSelector<ModalState>('modal');

export const isModalOpen = (modalId: string) =>
  createSelector(selectModalState, (state: ModalState) => state[modalId]);