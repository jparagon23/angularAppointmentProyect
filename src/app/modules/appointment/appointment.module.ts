import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppointmentRoutingModule } from './appointment-routing.module';
import { MakeReservationModalComponent } from './modals/make-reservation-modal/make-reservation-modal.component';

import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from '../shared/shared.module';
import { ReservationCardComponent } from './components/reservation-card/reservation-card.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { FormsModule } from '@angular/forms';
import { CancelReservationModalComponent } from './modals/cancel-reservation-modal/cancel-reservation-modal.component';
import { ConfirmationModalComponent } from './modals/confirmation-modal/confirmation-modal.component';

@NgModule({
  declarations: [
    MakeReservationModalComponent,
    ReservationCardComponent,
    DashboardPageComponent,
    CancelReservationModalComponent,
    ConfirmationModalComponent,
  ],
  imports: [
    CommonModule,
    AppointmentRoutingModule,
    MatDialogModule,
    MatButtonModule,
    SharedModule,
    FormsModule,
  ],
  exports: [MakeReservationModalComponent, ReservationCardComponent],
})
export class AppointmentModule {}
