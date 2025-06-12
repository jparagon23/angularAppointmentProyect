import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ClubInfo } from 'src/app/models/ClubInfo.model';

@Component({
  selector: 'app-club-card',
  templateUrl: './club-card.component.html',
})
export class ClubCardComponent {
  @Input() clubInfo?: ClubInfo;

  constructor(private readonly router: Router) {}

  sendToClubInfo() {
    if (!this.clubInfo) return;

    const currentPath = this.router.url;
    this.router.navigate([`${currentPath}`, this.clubInfo.id]);
  }
}
