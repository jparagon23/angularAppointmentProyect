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

  selectedDate: string | null = null;
  selectedMatchType: 'SINGLES' | 'DOUBLES' | null = null;
  challengeMessage: string = '';
  challengerUser: number = 1; // <-- Puedes cambiar esto según tu autenticación

  // Nuevas variables para selección de ubicación
  useCustomLocation: boolean = false;
  selectedClub: number | null = null;
  customLocation: string = '';

  // Simulación de clubes disponibles (puedes cargarlos desde API)
  availableClubs: { id: number, name: string }[] = [
    { id: 1, name: 'Club Los Andes' },
    { id: 2, name: 'Club La Raqueta' }
    // Puedes agregar más o cargarlos desde un servicio
  ];

  selectMatchType(type: 'SINGLES' | 'DOUBLES') {
    this.selectedMatchType = type;
  }

  sendChallenge() {
    // Validaciones básicas
    if (!this.selectedDate || !this.selectedMatchType) {
      alert('Debes seleccionar la fecha y el tipo de partido.');
      return;
    }

    // Validación de lugar
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
      opponentId: this.opponent?.id!,
      matchDate: this.selectedDate!,
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
