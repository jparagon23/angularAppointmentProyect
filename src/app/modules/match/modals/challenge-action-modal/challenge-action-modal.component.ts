import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChallengeService } from 'src/app/services/challenge.service';
import { NotificationItem } from 'src/app/models/notification/NotificationItem.model';
import { Challenge } from 'src/app/models/Challenge.model';
import { ChallengeResponseDTO } from 'src/app/models/challenges/UserChallenges.model';

@Component({
  selector: 'app-challenge-action-modal',
  templateUrl: './challenge-action-modal.component.html',
})
export class ChallengeActionModalComponent implements OnInit {
  challengeId: string | null = null;
  selectedChallenge: ChallengeResponseDTO | undefined;
  isChallengeLoading: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: NotificationItem,
    public dialogRef: MatDialogRef<ChallengeActionModalComponent>,
    private readonly challengeService: ChallengeService
  ) {}

  ngOnInit(): void {
    this.challengeId = this.getChallengeId(this.data);

    if (this.challengeId) {
      this.isChallengeLoading = true;
      this.challengeService
        .getChallengeById(Number(this.challengeId))
        .subscribe({
          next: (challenge) => {
            this.selectedChallenge = challenge;
            this.isChallengeLoading = false;
          },
          error: () => {
            this.isChallengeLoading = false;
            // puedes manejar errores aquí si lo necesitas
          },
        });
    }
  }

  getChallengeId(notification: { actionUrl: string }): string | null {
    const regex = /challenge\/(\d+)/;
    const match = regex.exec(notification.actionUrl);
    return match ? match[1] : null;
  }
}
