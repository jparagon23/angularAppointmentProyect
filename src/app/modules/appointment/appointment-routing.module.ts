import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MakeAppointmentPageComponent } from './pages/make-appointment-page/make-appointment-page.component';

const routes: Routes = [
  {
    path: 'make-appointment',
    component: MakeAppointmentPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppointmentRoutingModule {}
