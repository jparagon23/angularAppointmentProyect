import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ClubInfo } from 'src/app/models/ClubInfo.model';

@Component({
  selector: 'app-club-profile-header',
  templateUrl: './club-profile-header.component.html',
})
export class ClubProfileHeaderComponent {
  @Input() clubInfo!: ClubInfo;
  @Input() isMember = false;
  @Input() pendingMemberRequest = false;
  @Input() isClubAdmin = false;

  @Output() joinClub = new EventEmitter<void>();
  @Output() leaveClub = new EventEmitter<void>();
}
