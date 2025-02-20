import { Component, Input } from '@angular/core';
import { UserMatch } from 'src/app/models/events/UserMatch.model';

@Component({
  selector: 'app-result-short-section',
  templateUrl: './result-short-section.component.html',
  styleUrls: ['./result-short-section.component.css'],
})
export class ResultShortSectionComponent {
  @Input() matchToShow: UserMatch[] = [];
  @Input() title: string = '';
  @Input() canConfirm: boolean = false;
  sliceLimit = 6;
  pendingSliceLimit = 6;
  initialLimit = 6;

  toggleResults(event: Event): void {
    event.preventDefault();
    this.pendingSliceLimit =
      this.pendingSliceLimit === this.initialLimit
        ? this.matchToShow.length
        : this.initialLimit;
  }
}
