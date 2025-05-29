import { ChallengeRecommendation } from 'src/app/models/challenges/ChallengeRecommendation.model';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClubMembership } from 'src/app/models/user.model';
import {
  Challenge,
  ChallengeStatus,
  MatchType,
} from 'src/app/models/Challenge.model';
import { UserListReturn } from 'src/app/models/UserListReturn.model';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import {
  createChallenge,
  getChallengeRecomendations,
  resetChallengeModalState,
} from 'src/app/state/challenges/challenges.actions';
import {
  selectChallengeRecommendations,
  selectCreateChallengeStatus,
} from 'src/app/state/challenges/challenges.selectos';
import { Subject, takeUntil } from 'rxjs';
import { selectUser } from 'src/app/state/selectors/users.selectors';
import { selectMembershipClubs } from 'src/app/state/membership/membership.selectors';
import { ClubInfo } from 'src/app/models/ClubInfo.model';
import { getActiveClubs } from 'src/app/state/membership/membership.actions';

@Component({
  selector: 'app-challenge-modal',
  templateUrl: './challenge-modal.component.html',
})
export class ChallengeModalComponent implements OnInit, OnDestroy {
  postChallengeStatus$ = this.store.select(selectCreateChallengeStatus);
  challengeRecommendations$ = this.store.select(selectChallengeRecommendations);
  clubs$ = this.store.select(selectMembershipClubs);

  private readonly destroy$ = new Subject<void>();

  opponent: {
    id: number;
    name: string;
    image: string;
    clubMemberships: ClubMembership[];
  } | null = null;

  recommendedUsers: ChallengeRecommendation[] = [];

  minDateTime: string = '';

  selectedDate: string | null = null;
  selectedMatchType: 'SINGLES' | 'DOUBLES' | null = 'SINGLES';
  challengeMessage: string = '';
  challengerUser: number = 0;
  useCustomLocation: boolean = false;
  selectedClub: number | null = null;
  customLocation: string = '';

  availableClubs: ClubInfo[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly dialogRef: MatDialogRef<ChallengeModalComponent>,
    private readonly store: Store<any>
  ) {
    if (data?.opponent) {
      this.opponent = data.opponent;
    }
  }
  ngOnInit(): void {
    this.setMinDateTime();

    // Dispatch acciones
    this.store.dispatch(getActiveClubs());
    this.store.dispatch(getChallengeRecomendations({}));

    // Suscripción a clubes activos
    this.clubs$.pipe(takeUntil(this.destroy$)).subscribe((clubs) => {
      if (clubs) {
        this.availableClubs = clubs.activeClubs;
      }
    });

    // Suscripción a recomendaciones
    this.challengeRecommendations$
      .pipe(takeUntil(this.destroy$))
      .subscribe((recommendations) => {
        if (recommendations) {
          this.recommendedUsers = recommendations.recommendations;
        }
      });

    // Usuario actual
    this.store
      .select(selectUser)
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        if (user) {
          this.challengerUser = user.id;
        }
      });

    // Estado del reto
    this.postChallengeStatus$
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ loading, success, failure }) => {
        if (loading) {
          Swal.fire({
            title: 'Retando al jugador...',
            text: 'Por favor espera',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });
        } else if (success) {
          Swal.fire({
            icon: 'success',
            title: 'El reto ha sido creado!',
            text: 'El resultado se publicó correctamente.',
          }).then(() => this.dialogRef.close());
        } else if (failure) {
          Swal.fire({
            icon: 'error',
            title: 'Error al publicar el reto',
            text: 'Hubo un problema al publicar el reto. Por favor, inténtalo de nuevo.',
          });
        }
      });
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

    this.store.dispatch(createChallenge({ challenge }));
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.store.dispatch(resetChallengeModalState());
  }
}
