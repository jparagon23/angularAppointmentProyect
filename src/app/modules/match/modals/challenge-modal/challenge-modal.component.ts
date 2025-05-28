import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClubMembership } from 'src/app/models/user.model';
import {
  Challenge,
  ChallengeStatus,
  MatchType,
} from 'src/app/models/Challenge.model';
import { UserListReturn } from 'src/app/models/UserListReturn.model';
import { ChallengeService } from 'src/app/services/challenge.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-challenge-modal',
  templateUrl: './challenge-modal.component.html',
})
export class ChallengeModalComponent implements OnInit {
  opponent: {
    id: number;
    name: string;
    image: string;
    clubMemberships: ClubMembership[];
  } | null = null;

  recommendedUsers = [
    {
      id: 2,
      rating: 4.3,
      city: 'cali',
      name: 'Carlos Rodríguez',
      image: 'https://i.pravatar.cc/150?img=12',
      clubMemberships: [{ clubName: 'Club La Raqueta' }],
    },
    {
      id: 3,
      rating: 4.3,
      city: 'cali',
      name: 'Lucía Gómez',
      image: 'https://i.pravatar.cc/150?img=24',
      clubMemberships: [{ clubName: 'Club Las Palmas' }],
    },
    {
      id: 3,
      rating: 4.3,
      city: 'cali',
      name: 'Carlos Perez',
      image: 'https://i.pravatar.cc/150?img=12',
      clubMemberships: [{ clubName: 'Club La Raqueta' }],
    },
    {
      id: 4,
      rating: 4.3,
      city: 'cali',
      name: 'Lucía Hijema',
      image: 'https://i.pravatar.cc/150?img=24',
      clubMemberships: [{ clubName: 'Club Las Palmas' }],
    },
  ];

  minDateTime: string = '';

  selectedDate: string | null = null;
  selectedMatchType: 'SINGLES' | 'DOUBLES' | null = 'SINGLES';
  challengeMessage: string = '';
  challengerUser: number = 1;
  useCustomLocation: boolean = false;
  selectedClub: number | null = null;
  customLocation: string = '';

  availableClubs = [
    { id: 1, name: 'Club Los Andes' },
    { id: 2, name: 'Club La Raqueta' },
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly dialogRef: MatDialogRef<ChallengeModalComponent>,
    private readonly challengeService: ChallengeService
  ) {
    if (data?.opponent) {
      this.opponent = null;
    }
  }
  ngOnInit(): void {
    this.setMinDateTime();
  }

  selectMatchType(type: 'SINGLES' | 'DOUBLES') {
    this.selectedMatchType = type;
  }
  setMinDateTime() {
    const now = new Date();
    now.setSeconds(0, 0); // para evitar segundos/milisegundos
    this.minDateTime = now.toISOString().slice(0, 16); // formato yyyy-MM-ddTHH:mm
  }

  onUserSelectedFromSearch(user: UserListReturn | null) {
    if (!user) {
      this.opponent = null;
      return;
    }

    const selectedUserId = Number(user.userId);
    if (selectedUserId === this.challengerUser) {
      Swal.fire('Acción inválida', 'No puedes retarte a ti mismo.', 'warning');
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
      Swal.fire('Oponente requerido', 'Selecciona un oponente.', 'warning');
      return;
    }

    if (!this.selectedDate || !this.selectedMatchType) {
      Swal.fire(
        'Datos incompletos',
        'Debes seleccionar la fecha y el tipo de partido.',
        'warning'
      );
      return;
    }

    if (!this.useCustomLocation && !this.selectedClub) {
      Swal.fire('Club requerido', 'Selecciona un club.', 'warning');
      return;
    }

    if (this.useCustomLocation && this.customLocation.trim() === '') {
      Swal.fire(
        'Dirección requerida',
        'Especifica la dirección del lugar.',
        'warning'
      );
      return;
    }

    const challenge: Challenge = {
      challengerId: this.challengerUser,
      challengedId: this.opponent.id,
      challengeDateTime: this.selectedDate,
      matchType:
        this.selectedMatchType === 'SINGLES'
          ? MatchType.SINGLES
          : MatchType.DOUBLES,
      message: this.challengeMessage,
      status: ChallengeStatus.PENDING,
      clubId: !this.useCustomLocation ? this.selectedClub! : undefined,
      customLocation: this.useCustomLocation ? this.customLocation : undefined,
    };

    this.challengeService.createChallenge(challenge).subscribe({
      next: () => {
        Swal.fire(
          'Desafío enviado',
          'Tu desafío fue enviado exitosamente.',
          'success'
        ).then(() => {
          this.closeModal();
        });
      },
      error: () => {
        Swal.fire(
          'Error',
          'Error al enviar el desafío. Inténtalo de nuevo más tarde.',
          'error'
        );
      },
    });
  }

  closeModal() {
    this.dialogRef.close();
  }

  selectRecommendedOpponent(user: any) {
    if (user.id === this.challengerUser) {
      Swal.fire('Acción inválida', 'No puedes retarte a ti mismo.', 'warning');
      return;
    }

    this.opponent = {
      id: user.id,
      name: user.name,
      image: user.image,
      clubMemberships: user.clubMemberships,
    };
  }
}
