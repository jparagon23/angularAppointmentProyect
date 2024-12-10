import { Component, Input } from '@angular/core';
import { UserMatch } from 'src/app/models/events/UserMatch.model';

@Component({
  selector: 'app-match-result-card',
  templateUrl: './match-result-card.component.html',
  styleUrls: ['./match-result-card.component.css'],
})
export class MatchResultCardComponent {
  @Input() matchData!: UserMatch;
}
