import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { UserMatchesStats } from 'src/app/models/events/UserMatchesStats.model';
import {
  getUserMatchesStats,
  resetUserMatchesStatsState,
} from 'src/app/state/actions/event.actions';
import { AppState } from 'src/app/state/app.state';
import { selectUserMatchState } from 'src/app/state/selectors/event.selectors';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-matches-stats-page',
  templateUrl: './matches-stats-page.component.html',
})
export class MatchesStatsPageComponent implements OnInit, OnDestroy, OnChanges {
  userStats?: UserMatchesStats;
  private readonly destroy$ = new Subject<void>();
  @Input() matchType: string = 'SINGLES';
  matchTypeQuery: string = '';

  constructor(private readonly store: Store<AppState>) {}

  ngOnInit(): void {
    this.loadUserStats();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['matchType'] && !changes['matchType'].firstChange) {
      this.store.dispatch(resetUserMatchesStatsState()); // Limpia el estado antes de recargar
      this.loadUserStats();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.store.dispatch(resetUserMatchesStatsState());
  }

  private loadUserStats(): void {
    const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutos en milisegundos

    this.showLoader();

    this.store
      .select(selectUserMatchState)
      .pipe(take(1))
      .subscribe((state) => {
        const now = Date.now();
        const isOutdated =
          !state.lastUpdated || now - state.lastUpdated > REFRESH_INTERVAL;

        if (
          !state.userMatchesStats ||
          isOutdated ||
          this.matchType !== this.matchTypeQuery
        ) {
          this.matchTypeQuery = this.matchType;
          this.store.dispatch(
            getUserMatchesStats({ matchType: this.matchType })
          );
        }
      });

    this.store
      .select(selectUserMatchState)
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => this.handleStateChange(state));
  }

  private handleStateChange({
    loading,
    success,
    failure,
    userMatchesStats,
  }: {
    loading: boolean;
    success: boolean;
    failure: boolean;
    userMatchesStats?: UserMatchesStats;
  }): void {
    if (loading) return;

    this.dismissLoader();

    if (success) {
      this.updateStats(userMatchesStats);
    } else if (failure) {
      this.showError(
        'Error',
        'Error al cargar las estadísticas de partidos. Por favor, intenta nuevamente.'
      );
    }
  }

  private updateStats(stats?: UserMatchesStats): void {
    if (!stats) return;

    if (JSON.stringify(this.userStats) !== JSON.stringify(stats)) {
      this.userStats = stats;
    }
  }

  private showLoader(): void {
    Swal.fire({
      title: 'Cargando...',
      text: 'Por favor espera mientras se cargan los datos.',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });
  }

  private dismissLoader(): void {
    Swal.close();
  }

  private showError(title: string, message: string): void {
    Swal.fire({
      title,
      text: message,
      icon: 'error',
    });
  }
}
