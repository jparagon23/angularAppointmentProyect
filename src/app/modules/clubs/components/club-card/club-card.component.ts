import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-club-card',
  templateUrl: './club-card.component.html',
})
export class ClubCardComponent {
  @Input() logo!: string;
  @Input() name!: string;
  @Input() city!: string;
  @Input() members!: number;

  constructor(private router: Router) {}

  sendToClubInfo() {
    const currentPath = this.router.url; // Get current path
    this.router.navigate([`${currentPath}`, 1]); // Append ID to current path
  }
}
