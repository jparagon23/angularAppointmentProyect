import { MatchService } from 'src/app/services/match.service';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  UserMatch,
  UserMatchResponse,
} from 'src/app/models/events/UserMatch.model';
import { NotificationItem } from 'src/app/models/notification/NotificationItem.model';
import { AppState } from 'src/app/state/app.state';
import { selectUserMatches } from 'src/app/state/selectors/event.selectors';

@Component({
  selector: 'app-match-action-modal',
  templateUrl: './match-action-modal.component.html',
})
export class MatchActionModalComponent {
  userMatches$: Observable<UserMatchResponse | undefined> =
    this.store.select(selectUserMatches);
  matchId: string | null = null;
  matchData!: UserMatch;
  selectedMatch: UserMatch | undefined;

  isMatchLoading: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: NotificationItem,
    private readonly store: Store<AppState>,
    public dialogRef: MatDialogRef<MatchActionModalComponent>, // Inyecta MatDialogRef
    public matchService: MatchService,
    
  ) {}

  ngOnInit(): void {
    this.matchId = this.getMatchId(this.data);

    // Obtener el match y asignarlo
    this.userMatches$.subscribe((matches) => {
      const foundMatch = matches?._embedded?.matchResponseDTOList?.find(
        (match) => match.matchId === Number(this.matchId)
      );
    
      if (foundMatch) {
        this.selectedMatch = foundMatch;
        this.isMatchLoading = false;
      } else {
        this.isMatchLoading = true;
        this.matchService.getMatchById(Number(this.matchId)).subscribe((match) => {
          this.selectedMatch = match;
          this.isMatchLoading = false;
        });
      }
    });
    
  }

  getMatchId(notification: { actionUrl: string }) {
    const regex = /match\/(\d+)/;
    const matchId = regex.exec(notification.actionUrl);
    return matchId ? matchId[1] : null;
  }
}
