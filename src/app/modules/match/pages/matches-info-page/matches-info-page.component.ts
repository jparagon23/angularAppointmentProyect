import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { getUserMatches } from 'src/app/state/actions/event.actions';
import { selectGetUserMatchesStatus } from 'src/app/state/selectors/event.selectors';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-matches-info-page',
  templateUrl: './matches-info-page.component.html',
})
export class MatchesInfoPageComponent implements OnChanges, OnInit {
  @Input() matchType: string = 'SINGLES';
  matches$: Observable<any[]>;
  currentPage: number = 0;
  pageSize: number = 10;

  loading$: Observable<boolean>;

  constructor(private readonly store: Store<any>) {
    this.loading$ = this.store.select(selectGetUserMatchesStatus).pipe(
      map((state) => state.loading) // Obtiene el estado de carga
    );

    this.matches$ = this.store.select(selectGetUserMatchesStatus).pipe(
      map(
        (matchesData) =>
          matchesData.userMatch?._embedded?.matchResponseDTOList?.filter(
            (match) => match.matchType === this.matchType
          ) ?? [] // Fallback si algo es null/undefined
      )
    );
  }

  ngOnInit(): void {
    this.loadMatches(0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['matchType'] && !changes['matchType'].firstChange) {
      this.loadMatches(0);
    }
  }

  private loadMatches(page: number): void {
    this.store.dispatch(
      getUserMatches({ matchtype: this.matchType, page: page, size: 10 })
    );
  }

  nextPage(): void {
    this.currentPage++;
    this.loadMatches(this.currentPage);
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadMatches(this.currentPage);
    }
  }
}
