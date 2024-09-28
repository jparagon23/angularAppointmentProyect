import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardPageComponent } from './pages/admin-dashboard-page/admin-dashboard-page.component';

const routes: Routes = [
  {
    path: '',
    component: AdminDashboardPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
