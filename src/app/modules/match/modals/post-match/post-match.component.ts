import { CLUB_ADMIN_ROLE } from 'src/app/modules/shared/constants/Constants.constants';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { MatchResultDto } from 'src/app/models/PostResult.model';
import { User } from 'src/app/models/user.model';
import { UserListReturn } from 'src/app/models/UserListReturn.model';
import {
  publishMatchResult,
  resetPostScoreStatus,
} from 'src/app/state/actions/event.actions';
import { AppState } from 'src/app/state/app.state';
import { selectPostScoreStatus } from 'src/app/state/selectors/event.selectors';
import { selectUser } from 'src/app/state/selectors/users.selectors';
import Swal from 'sweetalert2';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-post-match',
  templateUrl: './post-match.component.html',
})
export class PostMatchComponent implements OnInit, OnDestroy {
  searchTerm: string = '';
  matchDate: string = '';

  winner: string | null = null;

  user$ = this.store.select(selectUser);
  status$ = this.store.select(selectPostScoreStatus);

  player1: { id: number; name: string; image: string } | null = null;
  player2: { id: number; name: string; image: string } | null = null;

  user: User | null = null;

  setResults: any;
  CLUB_ADMIN_ROLE = CLUB_ADMIN_ROLE;

  private destroy$ = new Subject<void>();

  constructor(
    private store: Store<AppState>,
    public dialogRef: MatDialogRef<PostMatchComponent>
  ) {}

  ngOnInit(): void {
    this.matchDate = new Date().toISOString().split('T')[0];
    this.user$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      if (user) {
        this.user = user;
        this.player1 = this.player1 = {
          id: Number(user!.id),
          name: user!.name.concat(' ', user!.lastname),
          image: user!.profileImage ?? '',
        };
      }
    });

    this.status$
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ loading, success, failure }) => {
        if (loading) {
          Swal.fire({
            title: 'Publicando resultado...',
            text: 'Por favor espera',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });
        } else if (success) {
          Swal.fire({
            icon: 'success',
            title: 'Resultado publicado!',
            text: 'El resultado se publicó correctamente.',
          }).then(() => this.dialogRef.close()); // Cerrar modal tras éxito
        } else if (failure) {
          Swal.fire({
            icon: 'error',
            title: 'Error al publicar el resultado',
            text: 'Hubo un problema al publicar el resultado. Por favor, inténtalo de nuevo.',
          });
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.store.dispatch(resetPostScoreStatus());
  }

  removePlayer(playerIndex: number): void {
    if (playerIndex === 1) this.player1 = null;
    if (playerIndex === 2) this.player2 = null;
  }

  // Método para seleccionar un jugador
  onUserSelectedP2(player: UserListReturn | null): void {
    if (!player) {
      this.player2 = null;
      return;
    }
    this.player2 = {
      id: Number(player.userId),
      name: player.completeName,
      image: player.profileImage,
    };
  }

  onUserSelectedP1(player: UserListReturn | null): void {
    if (!player) {
      this.player1 = null;
      return;
    }
    this.player1 = {
      id: Number(player.userId),
      name: player.completeName,
      image: player.profileImage,
    };
  }

  handleResult(result: any): void {
    this.setResults = result;
    this.setResults.winner
      ? (this.winner = this.setResults.winner)
      : (this.winner = null);
    console.log('Resultados recibidos:', this.setResults);
    console.log('Ganador:', this.winner);
  }

  updateWinnerIds(): void {
    if (!this.setResults || !this.setResults.sets) return;

    this.setResults.sets.forEach((set: any) => {
      if (set.winnerId === 'player1') {
        set.winnerId = this.player1?.id ?? 0;
      } else if (set.winnerId === 'player2') {
        set.winnerId = this.player2?.id;
      }
    });
  }

  publishResult(): void {
    if (!this.matchDate || isNaN(new Date(this.matchDate).getTime())) {
      Swal.fire('Error', 'Fecha inválida', 'error');
      return;
    }

    this.updateWinnerIds();

    const winnerId =
      this.setResults.winner === 'player1'
        ? this.player1?.id ?? 0
        : this.player2?.id ?? 0;
    const loserId =
      this.setResults.winner === 'player2'
        ? this.player1?.id ?? 0
        : this.player2?.id ?? 0;

    const json: MatchResultDto = {
      winnerId: winnerId ?? 0,
      loserId: loserId ?? 0,
      matchDate: this.matchDate,
      sets: this.setResults.sets,
      groupId: null,
    };

    this.store.dispatch(publishMatchResult({ matchResult: json }));
  }

  onDateChange(date: string): void {
    this.matchDate = date;
  }

  get canPublishResult(): boolean {
    return !!this.player1 && !!this.player2 && !!this.setResults?.winner;
  }
}
