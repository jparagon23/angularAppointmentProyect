import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostMatchComponent } from './modals/post-match/post-match.component';
import { FormsModule } from '@angular/forms';
import { UserCardComponent } from './components/user-card/user-card.component';
import { SetResultComponentComponent } from './components/set-result-component/set-result-component.component';
import { SharedModule } from '../shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatchActionModalComponent } from './modals/match-action-modal/match-action-modal.component';

@NgModule({
  declarations: [
    PostMatchComponent,
    UserCardComponent,
    SetResultComponentComponent,
    MatchActionModalComponent,
  ],
  imports: [CommonModule, FormsModule, SharedModule, MatDialogModule],
})
export class MatchModule {}
