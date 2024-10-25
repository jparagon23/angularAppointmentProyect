import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { UserInformationPageComponent } from '../shared/pages/user-information-page/user-information-page.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardPageComponent,
    pathMatch: 'full',
  },
  {
    path: 'user-information',
    component: UserInformationPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppointmentRoutingModule {}
