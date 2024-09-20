import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { cancelReservation } from 'src/app/state/actions/reservations.actions';
import { selectReservationSelected } from 'src/app/state/selectors/reservetions.selectors';
import { CancelReservationModalComponent } from '../cancel-reservation-modal/cancel-reservation-modal.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-confirmation-cancel-reservation',
  templateUrl: './confirmation-cancel-reservation.component.html',
})
export class ConfirmationCancelReservationComponent
  implements OnInit, OnDestroy
{
  private reservationSubscription!: Subscription;
  selectedReservation: any;

  constructor(
    private confirmCancelModal: MatDialogRef<ConfirmationCancelReservationComponent>,
    private store: Store<any>
  ) {}

  ngOnInit() {
    this.reservationSubscription = this.store
      .select(selectReservationSelected)
      .subscribe((reservation) => {
        this.selectedReservation = reservation;
      });
  }

  cancelProcess() {
    console.log('Cancel process');
    this.confirmCancelModal.close(true);
  }

  cancelConfirmed() {
    if (this.selectedReservation) {
      this.store.dispatch(
        cancelReservation({ reservation: this.selectedReservation })
      );
      this.confirmCancelModal.close(true);
    }
  }

  ngOnDestroy() {
    if (this.reservationSubscription) {
      this.reservationSubscription.unsubscribe();
    }
  }
}
