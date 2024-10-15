import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardPageComponent } from './pages/admin-dashboard-page/admin-dashboard-page.component';
import { CourtsPageComponent } from './components/court-config-component/courts-page.component';
import { ClubConfigurationPageComponent } from './pages/club-configuration-page/club-configuration-page.component';

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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
