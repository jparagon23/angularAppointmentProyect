import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { UserMatch } from 'src/app/models/events/UserMatch.model';

@Component({
  selector: 'app-result-short-section',
  templateUrl: './result-short-section.component.html',
})
export class ResultShortSectionComponent implements OnChanges {
  @Input() matchToShow: UserMatch[] = [];
  @Input() title: string = '';
  @Input() canConfirm: boolean = false;
  @Input() isLoading: boolean = false;
  @Input() showWhenEmpty: boolean = false;
  @Input() limit: number = 6;

  pendingSliceLimit: number = this.limit;
  initialLimit: number = this.limit;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['limit']) {
      this.pendingSliceLimit = this.limit;
      this.initialLimit = this.limit;
    }
  }

  toggleResults(event: Event): void {
    event.preventDefault();
    this.pendingSliceLimit =
      this.pendingSliceLimit === this.initialLimit
        ? this.matchToShow.length
        : this.initialLimit;
  }
}
