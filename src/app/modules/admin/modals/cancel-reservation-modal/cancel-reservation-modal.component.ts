import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalService } from 'src/app/services/modal.service';
import { CancellationClubCauses } from 'src/app/models/CancellationClubCauses.model';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectCancellationCauses } from 'src/app/state/selectors/reservetions.selectors';
import { AppState } from 'src/app/state/app.state';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-cancel-reservation-modal',
  templateUrl: './cancel-reservation-modal.component.html',
  styleUrls: ['./cancel-reservation-modal.component.css'],
})
export class CancelReservationModalComponent implements OnInit, OnDestroy {
  cancellationReasons$: Observable<CancellationClubCauses[]> =
    this.store.select(selectCancellationCauses);
  selectedReason: string = '';
  customReason: string = '';
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly dialogRef: MatDialogRef<CancelReservationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { text: string },
    private readonly modalService: ModalService,
    private readonly store: Store<AppState>
  ) {}

  ngOnInit(): void {
    // Subscribe to cancellation reasons and set the default selected reason
    this.cancellationReasons$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (reasons) => {
        if (reasons && reasons.length > 0) {
          this.selectedReason = reasons[0].id.toString();
        }
      },
      error: (err) => {
        console.error('Error loading cancellation reasons:', err);
      },
    });

    // Add the dialog reference to the modal service
    this.modalService.add(this.dialogRef);
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.destroy$.next();
    this.destroy$.complete();

    // Remove the dialog reference from the modal service
    this.modalService.remove(this.dialogRef);
  }

  onReasonChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedReason = selectElement.value;

    // Clear custom reason if a predefined reason is selected
    if (this.selectedReason !== 'other') {
      this.customReason = '';
    }
  }

  cancelProcess(): void {
    this.dialogRef.close(null);
  }

  cancelConfirmed(): void {
    // Prepare the result based on the selected reason
    const reason =
      this.selectedReason === 'other'
        ? { reasonText: this.customReason }
        : { cancellationReasonId: parseInt(this.selectedReason, 10) };

    console.log(reason);

    // Pass the result to the parent
    this.dialogRef.close(reason);
  }
}
