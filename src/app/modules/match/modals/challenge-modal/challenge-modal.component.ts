import { Component, Inject, OnInit, EventEmitter, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClubMembership, User } from 'src/app/models/user.model';
import { Challenge, ChallengeStatus, MatchType } from 'src/app/models/Challenge.model';
import { UserListReturn } from 'src/app/models/UserListReturn.model';

@Component({
  selector: 'app-challenge-modal',
  templateUrl: './challenge-modal.component.html'
})
export class ChallengeModalComponent {
  opponent: {
    id: number;
    name: string;
    image: string;
    clubMemberships: ClubMembership[];
  } | null = null;

  recommendedUsers: {
  id: number;
  rating:number;
  city:string;
  name: string;
  image: string;
  clubMemberships: { clubName: string }[];
}[] =  [
  {
    id: 2,
    rating:4.3,
    city:"cali",
    name: 'Carlos Rodríguez',
    image: 'https://i.pravatar.cc/150?img=12',
    clubMemberships: [{ clubName: 'Club La Raqueta' }]
  },
  {
    id: 3,
    rating:4.3,
    city:"cali",
    name: 'Lucía Gómez',
    image: 'https://i.pravatar.cc/150?img=24',
    clubMemberships: [{ clubName: 'Club Las Palmas' }]
  },
   {
    id: 3,
    rating:4.3,
    city:"cali",
    name: 'Carlos Perez',
    image: 'https://i.pravatar.cc/150?img=12',
    clubMemberships: [{ clubName: 'Club La Raqueta' }]
  },
  {
    id: 4,
    rating:4.3,
    city:"cali",
    name: 'Lucía Hijema',
    image: 'https://i.pravatar.cc/150?img=24',
    clubMemberships: [{ clubName: 'Club Las Palmas' }]
  },
];;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ChallengeModalComponent>
  ) {
    // Asignar el dato pasado por el modal
    if (data?.opponent) {
      this.opponent = null;
    }
  }


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

  }

  closeModal() {
    this.dialogRef.close();
  }

  selectRecommendedOpponent(user: any) {
  if (user.id === this.challengerUser) {
    alert('No puedes retarte a ti mismo.');
    return;
  }

  this.opponent = {
    id: user.id,
    name: user.name,
    image: user.image,
    clubMemberships: user.clubMemberships
  };
}
}
