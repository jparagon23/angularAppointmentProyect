import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectGetUserMatchesStatus } from 'src/app/state/selectors/event.selectors';

@Component({
  selector: 'app-matches-info-page',
  templateUrl: './matches-info-page.component.html',
})
export class MatchesInfoPageComponent implements OnChanges {
  @Input() matchType: 'SINGLES' | 'DOUBLES' = 'SINGLES';
  matches: any[] = [];

  selectGetUserMatchesStatus$ = this.store.select(selectGetUserMatchesStatus);

  constructor(private readonly store: Store<any>) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['matchType']) {
      // Aquí actualizamos los datos cada vez que el matchType cambia
      this.updateMatches();
    }
  }

  private updateMatches(): void {
    console.log('Updating matches for matchType:', this.matchType);
    this.selectGetUserMatchesStatus$.subscribe((matchesData) => {
      if (matchesData.userMatch) {
        // Filtrar los partidos según el tipo de partido (SINGLES o DOUBLES)
        this.matches = matchesData.userMatch.filter(
          (match) => match.matchType === this.matchType
        );
        console.log('Filtered matches:', this.matches);
      }
    });
  }
}
