import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { openModal } from 'src/app/state/actions/modals.actions';
import { AppState } from 'src/app/state/app.state';
import { isModalOpen } from 'src/app/state/selectors/modals.selectors';

@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html',
})
export class ErrorModalComponent {
  private subscription = new Subscription();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { message: string },
    private dialogRef: MatDialogRef<ErrorModalComponent>,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.openModal();
    this.subscribeToModalState();
  }

  private subscribeToModalState() {
    this.subscription.add(
      this.store.pipe(select(isModalOpen('errorModal'))).subscribe((isOpen) => {
        if (!isOpen) {
          this.dialogRef.close();
        }
      })
    );
  }

  private openModal() {
    this.store.dispatch(openModal({ modalId: 'errorModal' }));
  }

  closeModal() {
    this.dialogRef.close();
  }
}
