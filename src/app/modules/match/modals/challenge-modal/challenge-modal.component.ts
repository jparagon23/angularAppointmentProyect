import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Challenge, ChallengeStatus, MatchType } from 'src/app/models/Challenge.model';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-challenge-modal',
  templateUrl: './challenge-modal.component.html'
})
export class ChallengeModalComponent {

  @Input() opponent: User | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() challengeSent = new EventEmitter<Challenge>();

  selectedClub: number | null = null;
  selectedDate: string | null = null;
  selectedMatchType:'SINGLES' | 'DOUBLES' | null = null;
  challengeMessage: string = '';
  challengerUser:number=1;

  selectMatchType(type: 'SINGLES' | 'DOUBLES') {
this.selectedMatchType= type;
  }

  sendChallenge() {
    if (!this.selectedClub || !this.selectedDate || !this.selectedMatchType) {
      alert('Por favor completa todos los campos.');
      return;
    }

    const challenge: Challenge = {
      challengerId:this.challengerUser,
      opponentId: this.opponent?.id!,
      clubId: this.selectedClub!,
      matchDate: this.selectedDate!,
      matchType: this.selectedMatchType === 'SINGLES' ? MatchType.SINGLES : MatchType.DOUBLES,
      message: this.challengeMessage,
      status: ChallengeStatus.PENDING,
    };

    this.challengeSent.emit(challenge);
  }

  closeModal() {
    this.close.emit();
  }

}
