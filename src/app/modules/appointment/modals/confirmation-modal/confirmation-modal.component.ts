import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { cancelReservation } from 'src/app/state/actions/reservations.actions';
import { selectReservationSelected } from 'src/app/state/selectors/reservetions.selectors';
import { CancelReservationModalComponent } from '../cancel-reservation-modal/cancel-reservation-modal.component';
import { Subscription } from 'rxjs';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-confirmation-cancel-reservation',
  templateUrl: './confirmation-modal.component.html',
})
export class ConfirmationModalComponent implements OnInit, OnDestroy {
  constructor(
    private confirmCancelModal: MatDialogRef<ConfirmationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { text: string },
    private modalService: ModalService
  ) {}

  cancelProcess() {
    this.confirmCancelModal.close(false);
  }

  cancelConfirmed() {
    this.confirmCancelModal.close(true);
  }

  ngOnInit() {
    this.modalService.add(this.confirmCancelModal);
  }

  ngOnDestroy() {
    this.modalService.remove(this.confirmCancelModal);
  }
}