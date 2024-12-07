import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostMatchComponent } from './modals/post-match/post-match.component';
import { FormsModule } from '@angular/forms';
import { UserCardComponent } from './components/user-card/user-card.component';
import { SetResultComponentComponent } from './components/set-result-component/set-result-component.component';
import { SharedModule } from '../shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    PostMatchComponent,
    UserCardComponent,
    SetResultComponentComponent,
  ],
  imports: [CommonModule, FormsModule, SharedModule, MatDialogModule],
})
export class MatchModule {}
