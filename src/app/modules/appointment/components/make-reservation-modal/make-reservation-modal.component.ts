import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-make-reservation-modal',
  templateUrl: './make-reservation-modal.component.html',
})
export class MakeReservationModalComponent {
  constructor(
    public dialogRef: MatDialogRef<MakeReservationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onClickNO(): void {
    this.dialogRef.close();
  }
}
