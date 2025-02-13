import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-set-result-component',
  templateUrl: './set-result-component.component.html',
})
export class SetResultComponentComponent {
  // Initialize setResults with three sets, including tiebreak player scores
  setResults = [
    {
      player1: null,
      player2: null,
      tiebreakPlayer1: null,
      tiebreakPlayer2: null,
      winnerId: '',
    },
    {
      player1: null,
      player2: null,
      tiebreakPlayer1: null,
      tiebreakPlayer2: null,
      winnerId: '',
    },
    {
      player1: null,
      player2: null,
      tiebreakPlayer1: null,
      tiebreakPlayer2: null,
      winnerId: '',
    },
  ];

  // Track tiebreak visibility for each set
  tiebreakVisible: boolean[] = [false, false, false];

  @Output() resultEmitter: EventEmitter<any> = new EventEmitter();

  // Method to check for tiebreak visibility based on set scores
  checkTiebreak(setIndex: number): void {
    const set = this.setResults[setIndex];
    // Mostrar tiebreak solo si ambas puntuaciones no son null y la diferencia es 1
    this.tiebreakVisible[setIndex] =
      set.player1 !== null &&
      set.player2 !== null &&
      Math.abs(set.player1 - set.player2) === 1;
    this.emitResult();
  }

  // Method to calculate the winner and emit results
  emitResult(): void {
    const winner = this.calculateWinner();

    // Update property names based on the overall winner
    if (winner !== null) {
      this.updatePropertyNames(winner);
    }

    // Emit the results
    this.resultEmitter.emit({
      sets: this.updatePropertyNames(winner ?? ''),
      winner,
    });
  }

  // Method to calculate the overall winner
  calculateWinner(): string | null {
    let player1Wins = 0;
    let player2Wins = 0;

    this.setResults.forEach((set, index) => {
      if (set.player1 !== null && set.player2 !== null) {
        if (set.player1 > set.player2) {
          player1Wins++;
          set.winnerId = 'player1'; // Asignar el ganador de este set
        } else if (set.player2 > set.player1) {
          player2Wins++;
          set.winnerId = 'player2'; // Asignar el ganador de este set
        } else {
          set.winnerId = ''; // No hay ganador si los puntajes son iguales
        }
      } else {
        set.winnerId = ''; // Puntajes incompletos, no se asigna ganador
      }
    });

    if (player1Wins > player2Wins) {
      return 'player1';
    } else if (player2Wins > player1Wins) {
      return 'player2';
    } else {
      return null; // Empate o no hay ganador
    }
  }

  // Method to update property names in setResults
  updatePropertyNames(winner: string): {
    setNumber: number;
    winnerGames: number;
    loserGames: number;
    winnerTieBreak: number | null;
    loserTieBreak: number | null;
    winnerId: string;
  }[] {
    const result = this.setResults
      .filter((set) => set.player1 !== null && set.player2 !== null)
      .map((set) => {
        const player1 = set.player1 ?? 0;
        const player2 = set.player2 ?? 0;
        const tiebreakPlayer1 = set.tiebreakPlayer1 ?? null;
        const tiebreakPlayer2 = set.tiebreakPlayer2 ?? null;

        if (winner === 'player1') {
          return {
            setNumber: this.setResults.indexOf(set) + 1,
            winnerGames: player1,
            loserGames: player2,
            winnerTieBreak: tiebreakPlayer1,
            loserTieBreak: tiebreakPlayer2,
            winnerId: set.winnerId,
          };
        } else if (winner === 'player2') {
          return {
            setNumber: this.setResults.indexOf(set) + 1,
            winnerGames: player2,
            loserGames: player1,
            winnerTieBreak: tiebreakPlayer2,
            loserTieBreak: tiebreakPlayer1,
            winnerId: set.winnerId,
          };
        } else {
          console.error('No winner found');
          return {
            setNumber: this.setResults.indexOf(set) + 1,
            winnerGames: player1,
            loserGames: player2,
            winnerTieBreak: tiebreakPlayer1,
            loserTieBreak: tiebreakPlayer2,
            winnerId: set.winnerId,
          };
        }
      });

    return result;
  }
  limitInput(event: Event, limit: number): void {
    const input = event.target as HTMLInputElement;

    // Limitar a dos caracteres
    if (input.value.length > 2) {
      input.value = input.value.slice(0, 2);
    }

    // Validar rango permitido (entre 0 y 11 en este caso)
    const value = parseInt(input.value, 10);
    if (isNaN(value) || value < 0 || value > limit) {
      input.value = '';
    }
  }
}
