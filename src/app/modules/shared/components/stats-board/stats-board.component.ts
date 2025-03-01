import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { UserMatchesStats } from 'src/app/models/events/UserMatchesStats.model';

@Component({
  selector: 'app-stats-board',
  templateUrl: './stats-board.component.html',
  styleUrls: ['./stats-board.component.css'],
})
export class StatsBoardComponent implements OnInit, OnChanges {
  @Input() userStats?: UserMatchesStats;

  ngOnInit(): void {
    console.log('ngOnInit:', this.userStats);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userStats']) {
      console.log('ngOnChanges:', changes['userStats'].currentValue);
    }
  }
}
