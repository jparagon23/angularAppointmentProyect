import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardPageComponent } from './pages/admin-dashboard-page/admin-dashboard-page.component';
import { CourtsPageComponent } from './components/court-config-component/courts-page.component';
import { ClubConfigurationPageComponent } from './pages/club-configuration-page/club-configuration-page.component';
import { UserInformationPageComponent } from '../shared/pages/user-information-page/user-information-page.component';
import { ClubReportsComponent } from './pages/club-reports/club-reports.component';
import { UserProfileComponent } from '../user/pages/user-profile/user-profile-page.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full', // Necesario para que el redireccionamiento funcione correctamente
  },
  {
    path: 'dashboard',
    component: AdminDashboardPageComponent,
  },
  {
    path: 'courts',
    component: CourtsPageComponent,
  },
  {
    path: 'configuration',
    component: ClubConfigurationPageComponent,
  },
  {
    path: 'user-information',
    component: UserInformationPageComponent,
  },
  {
    path: 'reports',
    component: ClubReportsComponent,
  },
  {
    path: 'profile/:id',
    component: UserProfileComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
