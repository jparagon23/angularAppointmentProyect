import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppointmentRoutingModule } from './appointment-routing.module';
import { MakeAppointmentPageComponent } from './pages/make-appointment-page/make-appointment-page.component';
import { MakeReservationModalComponent } from './components/make-reservation-modal/make-reservation-modal.component';

import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [MakeAppointmentPageComponent, MakeReservationModalComponent],
  imports: [
    CommonModule,
    AppointmentRoutingModule,
    MatDialogModule,
    MatButtonModule,
    SharedModule,
  ],
  exports: [MakeReservationModalComponent],
})
export class AppointmentModule {}
