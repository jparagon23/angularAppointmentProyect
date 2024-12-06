import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-set-result-component',
  templateUrl: './set-result-component.component.html',
})
export class SetResultComponentComponent {
  // Initialize setResults with three sets, including tiebreak player scores
  setResults = [
    {
      player1: 0,
      player2: 0,
      tiebreakPlayer1: null,
      tiebreakPlayer2: null,
      winnerId: '',
    },
    {
      player1: 0,
      player2: 0,
      tiebreakPlayer1: null,
      tiebreakPlayer2: null,
      winnerId: '',
    },
    {
      player1: 0,
      player2: 0,
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
    // Show tiebreak if the difference between players' scores is 1
    this.tiebreakVisible[setIndex] = Math.abs(set.player1 - set.player2) === 1;
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
      if (set.player1 > set.player2) {
        player1Wins++;
        set.winnerId = 'player1'; // Assign the winner for this set
      } else if (set.player2 > set.player1) {
        player2Wins++;
        set.winnerId = 'player2'; // Assign the winner for this set
      } else {
        set.winnerId = ''; // No winner if scores are tied
      }
    });

    // Determine the overall winner based on the number of sets won
    if (player1Wins > player2Wins) {
      return 'player1';
    } else if (player2Wins > player1Wins) {
      return 'player2';
    } else {
      return null; // Tie or no winner
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
    console.log('this.result', this.setResults);

    const result = this.setResults
      .filter((set) => set.player1 !== 0 && set.player2 !== 0) // Filtrar sets con juegos diferentes de 0
      .map((set) => {
        if (winner === 'player1') {
          return {
            setNumber: this.setResults.indexOf(set) + 1,
            winnerGames: set.player1,
            loserGames: set.player2,
            winnerTieBreak: set.tiebreakPlayer1,
            loserTieBreak: set.tiebreakPlayer2,
            winnerId: set.winnerId,
          };
        } else if (winner === 'player2') {
          return {
            setNumber: this.setResults.indexOf(set) + 1,
            winnerGames: set.player2,
            loserGames: set.player1,
            winnerTieBreak: set.tiebreakPlayer2,
            loserTieBreak: set.tiebreakPlayer1,
            winnerId: set.winnerId,
          };
        } else {
          console.error('No winner found');
          // Return the original set structure if no winner is found
          return {
            setNumber: this.setResults.indexOf(set) + 1,
            winnerGames: set.player1,
            loserGames: set.player2,
            winnerTieBreak: set.tiebreakPlayer1,
            loserTieBreak: set.tiebreakPlayer2,
            winnerId: set.winnerId,
          };
        }
      });

    return result;
  }
}
