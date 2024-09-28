import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardPageComponent } from './pages/admin-dashboard-page/admin-dashboard-page.component';
import { AdminRoutingModule } from './admin-routing.module';
import { FormsModule } from '@angular/forms';
import { ReservationInfoModalComponent } from './modals/reservation-info-modal/reservation-info-modal.component';

@NgModule({
  declarations: [AdminDashboardPageComponent, ReservationInfoModalComponent],
  imports: [CommonModule, AdminRoutingModule, FormsModule],
})
export class AdminModule {}
