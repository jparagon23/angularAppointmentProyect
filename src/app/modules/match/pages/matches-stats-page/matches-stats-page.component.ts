import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
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
export class MatchesStatsPageComponent implements OnInit, OnDestroy {
  userStats?: UserMatchesStats;
  private readonly destroy$ = new Subject<void>();

  constructor(private readonly store: Store<AppState>) {}

  ngOnInit(): void {
    this.loadUserStats();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.store.dispatch(resetUserMatchesStatsState());
  }

  private loadUserStats(): void {
    this.showLoader();
    this.store.dispatch(getUserMatchesStats());

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

    // Actualiza solo si hay cambios en los datos
    if (JSON.stringify(this.userStats) !== JSON.stringify(stats)) {
      this.userStats = stats;
      console.log('Estadísticas actualizadas:', this.userStats);
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
