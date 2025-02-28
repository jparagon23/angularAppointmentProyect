import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from './pages/user-profile/user-profile-page.component';
import { SharedModule } from '../shared/shared.module';
import { MatchModule } from '../match/match.module';

@NgModule({
  declarations: [UserProfileComponent],
  imports: [CommonModule, SharedModule, MatchModule],
})
export class UserModule {}
