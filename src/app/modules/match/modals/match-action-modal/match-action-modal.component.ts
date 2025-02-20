import { MatchService } from 'src/app/services/match.service';
import { EventsService } from './../../../../services/events.service';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { UserMatch } from 'src/app/models/events/UserMatch.model';
import { NotificationItem } from 'src/app/models/notification/NotificationItem.model';
import { getMatchById } from 'src/app/state/actions/event.actions';
import { AppState } from 'src/app/state/app.state';
import { selectUserMatches } from 'src/app/state/selectors/event.selectors';

@Component({
  selector: 'app-match-action-modal',
  templateUrl: './match-action-modal.component.html',
})
export class MatchActionModalComponent {
  userMatches$: Observable<UserMatch[]> = this.store.select(selectUserMatches);
  matchId: string | null = null;
  matchData!: UserMatch;
  selectedMatch: UserMatch | undefined;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: NotificationItem,
    private readonly store: Store<AppState>,
    public dialogRef: MatDialogRef<MatchActionModalComponent>, // Inyecta MatDialogRef
    public matchService: MatchService
  ) {}

  ngOnInit(): void {
    this.matchId = this.getMatchId(this.data);

    // Obtener el match y asignarlo
    this.userMatches$.subscribe((matches) => {
      const foundMatch = matches.find(
        (match) => match.matchId === Number(this.matchId)
      );
      if (foundMatch) {
        this.selectedMatch = foundMatch;
      } else {
        this.matchService
          .getMatchById(Number(this.matchId))
          .subscribe((match) => {
            this.selectedMatch = match;
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
