import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardPageComponent } from './pages/admin-dashboard-page/admin-dashboard-page.component';
import { AdminRoutingModule } from './admin-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReservationInfoModalComponent } from './modals/reservation-info-modal/reservation-info-modal.component';
import { GroupReservationInfoModalComponent } from './modals/group-reservation-info-modal/group-reservation-info-modal.component';
import { CreateReservationFromTableModalComponent } from './modals/create-reservation-from-table-modal/create-reservation-from-table-modal.component';
import { SharedModule } from '../shared/shared.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ErrorModalComponent } from './modals/error-modal/error-modal.component';
import { CourtsPageComponent } from './components/court-config-component/courts-page.component';
import { CourtCardComponentComponent } from './components/court-card-component/court-card-component.component';
import { ClubConfigurationPageComponent } from './pages/club-configuration-page/club-configuration-page.component';
import { CourtConfigComponentComponent } from './components/availability-config-component/court-config-component.component';
import { CancelReservationModalComponent } from './modals/cancel-reservation-modal/cancel-reservation-modal.component';
import { CancellationCausesConfigComponent } from './components/cancellation-causes-config/cancellation-causes-config.component';
import { CreateLightUserModalComponent } from './modals/create-light-user-modal/create-light-user-modal.component';
import { UserNameMakeReservationModalComponent } from './modals/user-name-make-reservation-modal/user-name-make-reservation-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ClubReportsComponent } from './pages/club-reports/club-reports.component';

@NgModule({
  declarations: [
    AdminDashboardPageComponent,
    ReservationInfoModalComponent,
    GroupReservationInfoModalComponent,
    CreateReservationFromTableModalComponent,
    ErrorModalComponent,
    CourtsPageComponent,
    CourtCardComponentComponent,
    ClubConfigurationPageComponent,
    CourtConfigComponentComponent,
    CancelReservationModalComponent,
    CancellationCausesConfigComponent,
    CreateLightUserModalComponent,
    UserNameMakeReservationModalComponent,
    ClubReportsComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    SharedModule,
    MatAutocompleteModule,
    MatInputModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatDialogModule,
  ],
})
export class AdminModule {}
