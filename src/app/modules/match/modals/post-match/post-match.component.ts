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

  player1: User | null = null;
  player2: { id: number; name: string; image: string } | null = null;

  // Lista de jugadores para seleccionar

  // Lista filtrada de jugadores según el término de búsqueda

  // Variable para almacenar los resultados del set
  setResults: any;

  constructor(
    private store: Store<AppState>,
    public dialogRef: MatDialogRef<PostMatchComponent>,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.matchDate = new Date().toISOString().split('T')[0];
    this.user$.subscribe((user) => {
      if (user) {
        this.player1 = user;
      }
    });

    this.status$.subscribe(({ loading, success, failure }) => {
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
    this.store.dispatch(resetPostScoreStatus());
  }

  removePlayer(userIndex: number): void {
    console.log(`Eliminar usuario con índice: ${userIndex}`);
    if (userIndex == 1) {
      this.player1 = null;
    }
    if (userIndex == 2) {
      this.player2 = null;
    }
  }

  // Método para seleccionar un jugador
  onUserSelected(player: UserListReturn | null): void {
    this.player2 = {
      id: Number(player!.userId),
      name: player!.completeName,
      image: player!.profileImage,
    };
  }

  handleResult(result: any): void {
    this.setResults = result;
    this.setResults.winner ? (this.winner = this.setResults.winner) : null;
    console.log('Resultados recibidos:', this.setResults);
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
    this.updateWinnerIds();
    console.log('Publicando resultados...');
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

    console.log('Datos a publicar:', json);
    this.store.dispatch(publishMatchResult({ matchResult: json }));
  }

  onDateChange(date: string): void {
    this.matchDate = date;
  }

  get canPublishResult(): boolean {
    return !!this.player2 && !!this.setResults?.winner;
  }
}
