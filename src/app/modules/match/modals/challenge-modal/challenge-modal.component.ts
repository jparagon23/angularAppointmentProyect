import { Component, Inject, OnInit, EventEmitter, Output } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClubMembership, User } from 'src/app/models/user.model';
import { Challenge, ChallengeStatus, MatchType } from 'src/app/models/Challenge.model';
import { UserListReturn } from 'src/app/models/UserListReturn.model';

@Component({
  selector: 'app-challenge-modal',
  templateUrl: './challenge-modal.component.html'
})
export class ChallengeModalComponent implements OnInit {
  opponent: {
    id: number;
    name: string;
    image: string;
    clubMemberships: ClubMembership[];
  } | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Asignar el dato pasado por el modal
    if (data?.opponent) {
      this.opponent = data.opponent;
    }
  }

  ngOnInit(): void {
    console.log('Oponente recibido:', this.opponent);
  }

  @Output() close = new EventEmitter<void>();
  @Output() challengeSent = new EventEmitter<Challenge>();

  selectedDate: string | null = null;
  selectedMatchType: 'SINGLES' | 'DOUBLES' | null = "SINGLES";
  challengeMessage: string = '';
  challengerUser: number = 1;

  useCustomLocation: boolean = false;
  selectedClub: number | null = null;
  customLocation: string = '';

  availableClubs: { id: number, name: string }[] = [
    { id: 1, name: 'Club Los Andes' },
    { id: 2, name: 'Club La Raqueta' }
  ];

  selectMatchType(type: 'SINGLES' | 'DOUBLES') {
    this.selectedMatchType = type;
  }

  onUserSelectedFromSearch(user: UserListReturn | null) {
    if (!user) {
      this.opponent = null;
      return;
    }

    const selectedUserId = Number(user.userId);
    if (selectedUserId === this.challengerUser) {
      alert('No puedes retarte a ti mismo.');
      return;
    }

    this.opponent = {
      id: selectedUserId,
      name: user.completeName,
      image: user.profileImage,
      clubMemberships: user.userClubMemberships,
    };
  }

  clearOpponent() {
    this.opponent = null;
  }

  sendChallenge() {
    if (!this.opponent) {
      alert('Selecciona un oponente.');
      return;
    }

    if (!this.selectedDate || !this.selectedMatchType) {
      alert('Debes seleccionar la fecha y el tipo de partido.');
      return;
    }

    if (!this.useCustomLocation && !this.selectedClub) {
      alert('Selecciona un club.');
      return;
    }

    if (this.useCustomLocation && this.customLocation.trim() === '') {
      alert('Especifica la dirección del lugar.');
      return;
    }

    const challenge: Challenge = {
      challengerId: this.challengerUser,
      opponentId: this.opponent.id,
      matchDate: this.selectedDate,
      matchType: this.selectedMatchType === 'SINGLES' ? MatchType.SINGLES : MatchType.DOUBLES,
      message: this.challengeMessage,
      status: ChallengeStatus.PENDING,
      clubId: !this.useCustomLocation ? this.selectedClub! : undefined,
      customLocation: this.useCustomLocation ? this.customLocation : undefined
    };

    this.challengeSent.emit(challenge);
  }

  closeModal() {
    this.close.emit();
  }
}
