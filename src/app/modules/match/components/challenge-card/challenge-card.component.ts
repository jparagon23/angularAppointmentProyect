import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ChallengeResponseDTO } from 'src/app/models/challenges/UserChallenges.model';
import { User } from 'src/app/models/user.model';
import {
  acceptChallenge,
  deleteChallenge,
  rejectChallenge,
  resetChallengeCardState,
} from 'src/app/state/challenges/challenges.actions';
import { selectChallengesResultActionStatus } from 'src/app/state/challenges/challenges.selectos';
import { selectUser } from 'src/app/state/selectors/users.selectors';
import Swal from 'sweetalert2';
import { Router } from '@angular/router'; // ✅ AÑADIR

@Component({
  selector: 'app-challenge-card',
  templateUrl: './challenge-card.component.html',
})
export class ChallengeCardComponent implements OnInit, OnDestroy {
  @Input() challenge: ChallengeResponseDTO | undefined;

  challengesActions$ = this.store.select(selectChallengesResultActionStatus);
  user$: Observable<User | null> = this.store.select(selectUser);

  userCanConfirm: boolean = false;
  userCanDelete: boolean = false;
  currentUserId!: number;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly store: Store<any>,
    private readonly router: Router // ✅ INYECTAR
  ) {}

  ngOnInit(): void {
    this.user$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      if (user && this.challenge) {
        this.currentUserId = user.id; // ✅ GUARDAMOS currentUserId

        if (this.challenge.status === 'PENDING') {
          this.userCanConfirm =
            this.challenge.pendingConfirmationUsers?.includes(user.id) || false;
          this.userCanDelete =
            !this.challenge.pendingConfirmationUsers?.includes(user.id) || false;
        } else if (this.challenge.status === 'ACCEPTED') {
          this.userCanDelete = true;
        } else {
          this.userCanDelete = false;
          this.userCanConfirm = false;
        }
      }
    });

    this.challengesActions$
      .pipe(takeUntil(this.destroy$))
      .subscribe((status) => {
        if (status.loading) {
          Swal.fire({
            title: 'Cargando...',
            text: 'Por favor espera mientras procesamos tu solicitud.',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });
        } else {
          if (status.confirmSuccess) {
            Swal.fire('¡Éxito!', 'El reto ha sido aceptado.', 'success');
          } else if (status.confirmFailure) {
            Swal.fire('Error', 'No se pudo aceptar el reto.', 'error');
          }

          if (status.rejectSuccess) {
            Swal.fire('¡Éxito!', 'El reto ha sido rechazado.', 'success');
          } else if (status.rejectFailure) {
            Swal.fire('Error', 'No se pudo rechazar el reto.', 'error');
          }

          if (status.deleteSuccess) {
            Swal.fire('¡Éxito!', 'El reto ha sido eliminado.', 'success');
          } else if (status.deleteFailure) {
            Swal.fire('Error', 'No se pudo eliminar el reto.', 'error');
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.store.dispatch(resetChallengeCardState());
  }

  onAccept(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres aceptar este reto?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, aceptar',
      cancelButtonText: 'No, cancelar',
    }).then((result) => {
      if (result.isConfirmed && this.challenge) {
        this.store.dispatch(
          acceptChallenge({ challengeId: this.challenge.id })
        );
      }
    });
  }

  onReject(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres rechazar este reto?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, rechazar',
      cancelButtonText: 'No, cancelar',
    }).then((result) => {
      if (result.isConfirmed && this.challenge) {
        this.store.dispatch(
          rejectChallenge({ challengeId: this.challenge.id })
        );
      }
    });
  }

  onDelete(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres cancelar este reto?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar',
    }).then((result) => {
      if (result.isConfirmed && this.challenge) {
        this.store.dispatch(
          deleteChallenge({ challengeId: this.challenge.id })
        );
      }
    });
  }

  // ✅ MÉTODO DE CHAT
  redirectToChat(): void {
    if (!this.challenge) return;

    const targetUserId =
      this.challenge.challenger.id === this.currentUserId
        ? this.challenge.challenged.id
        : this.challenge.challenger.id;

    const targetUserName =
      this.challenge.challenger.id === this.currentUserId
        ? `${this.challenge.challenged.name} ${this.challenge.challenged.lastname}`
        : `${this.challenge.challenger.name} ${this.challenge.challenger.lastname}`;

    this.router.navigate(['/home/chat'], {
      queryParams: {
        userId: targetUserId,
        userName: targetUserName,
      },
    });
  }

  getChatTargetName(): string {
    if (!this.challenge) return '';
    return this.challenge.challenger.id === this.currentUserId
      ? this.challenge.challenged.name
      : this.challenge.challenger.name;
  }
}
