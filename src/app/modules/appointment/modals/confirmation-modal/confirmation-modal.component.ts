import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-confirmation-cancel-reservation',
  templateUrl: './confirmation-modal.component.html',
})
export class ConfirmationModalComponent implements OnInit, OnDestroy {
  constructor(
    private readonly confirmCancelModal: MatDialogRef<ConfirmationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { text: string },
    private readonly modalService: ModalService
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
