import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppointmentRoutingModule } from './appointment-routing.module';
import { MakeReservationModalComponent } from './modals/make-reservation-modal/make-reservation-modal.component';

import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from '../shared/shared.module';
import { ReservationCardComponent } from './components/reservation-card/reservation-card.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationModalComponent } from './modals/confirmation-modal/confirmation-modal.component';
import { AvailableSlotCardComponent } from './components/available-slot-card/available-slot-card.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReservationCalendarComponent } from './components/reservation-calendar/reservation-calendar.component';
import { MatchModule } from '../match/match.module';

@NgModule({
  declarations: [
    MakeReservationModalComponent,
    ReservationCardComponent,
    DashboardPageComponent,
    ConfirmationModalComponent,
    AvailableSlotCardComponent,
    ReservationCalendarComponent,
  ],
  imports: [
    CommonModule,
    AppointmentRoutingModule,
    MatDialogModule,
    MatButtonModule,
    SharedModule,
    FormsModule,
    MatAutocompleteModule,
    MatInputModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatchModule,
  ],
  exports: [
    MakeReservationModalComponent,
    ReservationCardComponent,
    ReservationCalendarComponent,
  ],
})
export class AppointmentModule {}
