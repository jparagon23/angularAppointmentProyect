import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardPageComponent } from './pages/admin-dashboard-page/admin-dashboard-page.component';
import { AdminRoutingModule } from './admin-routing.module';

@NgModule({
  declarations: [AdminDashboardPageComponent],
  imports: [CommonModule, AdminRoutingModule],
})
export class AdminModule {}
