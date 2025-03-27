import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { RankingInfo } from 'src/app/models/events/RankingInfo.model';
import { UserMatch } from 'src/app/models/events/UserMatch.model';
import { selectDashboardState } from 'src/app/state/dashboard-state/dashboard.selectors';
import { selectRankingState } from 'src/app/state/selectors/event.selectors';

@Component({
  selector: 'app-club-page',
  templateUrl: './club-page.component.html',
})
export class ClubPageComponent {
  constructor(private readonly store: Store<any>) {}

  selectGeneralRankingStatus$ = this.store.select(selectRankingState);
  selectDashboardState$ = this.store.select(selectDashboardState);
  ratings: RankingInfo[] = [
    {
      position: 1,
      image: 'https://via.placeholder.com/100',
      userName: 'Carlos',
      userLastname: 'Gómez',
      rating: 9.8,
      userId: 101,
    },
    {
      position: 2,
      image: 'https://via.placeholder.com/100',
      userName: 'Ana',
      userLastname: 'Martínez',
      rating: 9.5,
      userId: 102,
    },
    {
      position: 3,
      image: 'https://via.placeholder.com/100',
      userName: 'Luis',
      userLastname: 'Fernández',
      rating: 9.2,
      userId: 103,
    },
    {
      position: 4,
      image: 'https://via.placeholder.com/100',
      userName: 'Sofía',
      userLastname: 'Pérez',
      rating: 8.9,
      userId: 104,
    },
    {
      position: 5,
      image: 'https://via.placeholder.com/100',
      userName: 'Miguel',
      userLastname: 'Rodríguez',
      rating: 8.7,
      userId: 105,
    },
  ];  

  // userMatches:UserMatch[]= [
  //     {
  //       "matchId": 52,
  //       "matchDate": "2025-03-19",
  //       "status": "CONFIRMED",
  //       "matchType": "SINGLES",
  //       "winner": {
  //         "id": 1,
  //         "name": "Juan Pablo",
  //         "lastname": "Aragon Alzate"
  //       },
  //       "winner2": null,
  //       "loser": {
  //         "id": 42,
  //         "name": "Paula Tatiana",
  //         "lastname": "Naranjo Palacio"
  //       },
  //       "loser2": null,
  //       "sets": [
  //         {
  //           "setNumber": 1,
  //           "winnerGames": 6,
  //           "loserGames": 1,
  //           "winnerTieBreak": 0,
  //           "loserTieBreak": 0
  //         }
  //       ],
  //       "pendingConfirmationUsers": null
  //     },
  //     {
  //       "matchId": 49,
  //       "matchDate": "2025-03-17",
  //       "status": "CONFIRMED",
  //       "matchType": "SINGLES",
  //       "winner": {
  //         "id": 1,
  //         "name": "Juan Pablo",
  //         "lastname": "Aragon Alzate"
  //       },
  //       "winner2": null,
  //       "loser": {
  //         "id": 42,
  //         "name": "Paula Tatiana",
  //         "lastname": "Naranjo Palacio"
  //       },
  //       "loser2": null,
  //       "sets": [
  //         {
  //           "setNumber": 1,
  //           "winnerGames": 6,
  //           "loserGames": 1,
  //           "winnerTieBreak": 0,
  //           "loserTieBreak": 0
  //         }
  //       ],
  //       "pendingConfirmationUsers": null
  //     },
  //     {
  //       "matchId": 50,
  //       "matchDate": "2025-03-17",
  //       "status": "CONFIRMED",
  //       "matchType": "SINGLES",
  //       "winner": {
  //         "id": 1,
  //         "name": "Juan Pablo",
  //         "lastname": "Aragon Alzate"
  //       },
  //       "winner2": null,
  //       "loser": {
  //         "id": 177,
  //         "name": "Angela",
  //         "lastname": "Olaya"
  //       },
  //       "loser2": null,
  //       "sets": [
  //         {
  //           "setNumber": 1,
  //           "winnerGames": 6,
  //           "loserGames": 1,
  //           "winnerTieBreak": 0,
  //           "loserTieBreak": 0
  //         }
  //       ],
  //       "pendingConfirmationUsers": null
  //     },
  //     {
  //       "matchId": 51,
  //       "matchDate": "2025-03-17",
  //       "status": "CONFIRMED",
  //       "matchType": "SINGLES",
  //       "winner": {
  //         "id": 42,
  //         "name": "Paula Tatiana",
  //         "lastname": "Naranjo Palacio"
  //       },
  //       "winner2": null,
  //       "loser": {
  //         "id": 1,
  //         "name": "Juan Pablo",
  //         "lastname": "Aragon Alzate"
  //       },
  //       "loser2": null,
  //       "sets": [
  //         {
  //           "setNumber": 1,
  //           "winnerGames": 7,
  //           "loserGames": 5,
  //           "winnerTieBreak": 0,
  //           "loserTieBreak": 0
  //         }
  //       ],
  //       "pendingConfirmationUsers": null
  //     },
  //     {
  //       "matchId": 48,
  //       "matchDate": "2025-03-12",
  //       "status": "CONFIRMED",
  //       "matchType": "SINGLES",
  //       "winner": {
  //         "id": 1,
  //         "name": "Juan Pablo",
  //         "lastname": "Aragon Alzate"
  //       },
  //       "winner2": null,
  //       "loser": {
  //         "id": 43,
  //         "name": "Sebastian",
  //         "lastname": "Reyes Martinez"
  //       },
  //       "loser2": null,
  //       "sets": [
  //         {
  //           "setNumber": 1,
  //           "winnerGames": 6,
  //           "loserGames": 1,
  //           "winnerTieBreak": 0,
  //           "loserTieBreak": 0
  //         }
  //       ],
  //       "pendingConfirmationUsers": null
  //     }
  //   ]
  
}
