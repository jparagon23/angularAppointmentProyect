import { Component, Input } from '@angular/core';
import { MembershipDTO } from 'src/app/models/MembershipDTO.model';

@Component({
  selector: 'app-short-scroll-membership-section',
  templateUrl: './short-scroll-membership-section.component.html',
})
export class ShortScrollMembershipSectionComponent {
  @Input() memberships: MembershipDTO[] = [];
  @Input() title: string = '';

  onMembershipAction(doneMembership: MembershipDTO) {
    this.memberships = this.memberships.filter(
      (m) =>
        m.userId !== doneMembership.userId || m.clubId !== doneMembership.clubId
    );
  }
}
