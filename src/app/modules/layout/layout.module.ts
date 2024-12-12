import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LayoutComponent } from './components/layout/layout.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from '../shared/shared.module';

import { OverlayModule } from '@angular/cdk/overlay';

import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { AppointmentModule } from '../appointment/appointment.module';
import { MatchModule } from '../match/match.module';
import { NotificationItemComponent } from '../shared/components/notificartion-card/notification-item.component';

@NgModule({
  declarations: [LayoutComponent, NavbarComponent],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    OverlayModule,
    FontAwesomeModule,
    SharedModule,
    MatDialogModule,
    MatButtonModule,
    AppointmentModule,
    MatchModule,
    NotificationItemComponent,
  ],
})
export class LayoutModule {}
