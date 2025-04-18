import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClubsPagesComponent } from './pages/clubs-pages/clubs-pages.component';
import { ClubCardComponent } from './components/club-card/club-card.component';
import { ClubsRoutingModule } from './clubs-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ClubPageComponent } from './pages/club-page/club-page.component';
import { MembershipCardComponent } from './components/membership-card/membership-card.component';
import { ShortScrollMembershipSectionComponent } from './components/short-scroll-membership-section/short-scroll-membership-section.component';
import { ClubProfileHeaderComponent } from './components/club-profile-header/club-profile-header.component';
import { MatchModule } from '../match/match.module';
import { ClubMembersTableComponent } from './components/club-members-table/club-members-table.component';
import { ClubMatchesSectionComponent } from './components/club-matches-section/club-matches-section.component';

@NgModule({
  declarations: [
    ClubsPagesComponent,
    ClubCardComponent,
    ClubPageComponent,
    MembershipCardComponent,
    ShortScrollMembershipSectionComponent,
    ClubProfileHeaderComponent,
    ClubMembersTableComponent,
    ClubMatchesSectionComponent,
  ],
  exports: [MembershipCardComponent, ShortScrollMembershipSectionComponent],

  imports: [CommonModule, ClubsRoutingModule, SharedModule, MatchModule],
})
export class ClubsModule {}
