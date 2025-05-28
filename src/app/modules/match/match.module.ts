import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostMatchComponent } from './modals/post-match/post-match.component';
import { FormsModule } from '@angular/forms';
import { UserCardComponent } from './components/user-card/user-card.component';
import { SetResultComponentComponent } from './components/set-result-component/set-result-component.component';
import { SharedModule } from '../shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatchActionModalComponent } from './modals/match-action-modal/match-action-modal.component';
import { MatchesPageComponent } from './pages/matches-page/matches-page.component';
import { MatchesInfoPageComponent } from './pages/matches-info-page/matches-info-page.component';
import { MatchesStatsPageComponent } from './pages/matches-stats-page/matches-stats-page.component';
import { ResultShortSectionComponent } from './components/result-short-section/result-short-section.component';
import { ChallengeModalComponent } from './modals/challenge-modal/challenge-modal.component';
import { MatchPaginationComponent } from './components/match-pagination/match-pagination.component';
import { ChallengeCardComponent } from './components/challenge-card/challenge-card.component';

@NgModule({
  declarations: [
    PostMatchComponent,
    UserCardComponent,
    SetResultComponentComponent,
    MatchActionModalComponent,
    MatchesPageComponent,
    MatchesInfoPageComponent,
    MatchesStatsPageComponent,
    ResultShortSectionComponent,
    ChallengeModalComponent,
    MatchPaginationComponent,
    ChallengeCardComponent,
  ],
  imports: [CommonModule, FormsModule, SharedModule, MatDialogModule],
  exports: [
    ResultShortSectionComponent,
    MatchesInfoPageComponent,
    MatchPaginationComponent,
  ],
})
export class MatchModule {}
