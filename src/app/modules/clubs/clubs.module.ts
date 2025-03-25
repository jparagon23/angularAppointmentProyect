import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClubsPagesComponent } from './pages/clubs-pages/clubs-pages.component';
import { ClubCardComponent } from './components/club-card/club-card.component';
import { ClubsRoutingModule } from './clubs-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ClubPageComponent } from './pages/club-page/club-page.component';

@NgModule({
  declarations: [ClubsPagesComponent, ClubCardComponent, ClubPageComponent],
  imports: [CommonModule, ClubsRoutingModule, SharedModule],
})
export class ClubsModule {}
