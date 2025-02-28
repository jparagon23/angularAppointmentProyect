import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { MatchModule } from '../match/match.module';
import { UserProfileComponent } from './pages/user-profile/user-profile-page.component';

@NgModule({
  declarations: [UserProfileComponent],
  imports: [CommonModule, SharedModule, MatchModule],
})
export class UserModule {}
