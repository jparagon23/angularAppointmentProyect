import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppointmentRoutingModule } from './appointment-routing.module';
import { MakeAppointmentPageComponent } from './pages/make-appointment-page/make-appointment-page.component';


@NgModule({
  declarations: [
    MakeAppointmentPageComponent
  ],
  imports: [
    CommonModule,
    AppointmentRoutingModule
  ]
})
export class AppointmentModule { }
