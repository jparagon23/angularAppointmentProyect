import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { UserProfileComponent } from './pages/user-profile/user-profile-page.component';
import { SharedModule } from '../shared/shared.module';
import { MatchModule } from '../match/match.module';

@NgModule({
  declarations: [UserProfileComponent],
  imports: [CommonModule, SharedModule, MatchModule],
  providers: [DatePipe],
})
export class UserModule {}
