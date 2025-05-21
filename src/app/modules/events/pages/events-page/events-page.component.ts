import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-events-page',
  templateUrl: './events-page.component.html',
  styleUrls: ['./events-page.component.css'],
})
export class EventsPageComponent {
  constructor(private readonly router: Router) {}

  sendToEventnfo() {
    const currentPath = this.router.url; // Get current path
    this.router.navigate([`${currentPath}`, 1]); // Append ID to current path
  }
}
