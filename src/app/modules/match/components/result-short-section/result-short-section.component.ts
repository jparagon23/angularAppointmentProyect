import { Component, Input } from '@angular/core';
import { UserMatch } from 'src/app/models/events/UserMatch.model';

@Component({
  selector: 'app-result-short-section',
  templateUrl: './result-short-section.component.html',
})
export class ResultShortSectionComponent {
  @Input() matchToShow: UserMatch[] = [];
  @Input() title: string = '';
  @Input() canConfirm: boolean = false;
  @Input() isLoading: boolean = false;
  @Input() showWhenEmpty: boolean = false;
}
