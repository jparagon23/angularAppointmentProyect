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

@Component({
  selector: 'app-challenge-card',
  templateUrl: './challenge-card.component.html',
})
export class ChallengeCardComponent implements OnInit, OnDestroy {
  @Input() challenge: ChallengeResponseDTO | undefined;
  challengesActions$ = this.store.select(selectChallengesResultActionStatus);

  getUser$ = this.store;

  userCanConfirm: boolean = false;
  userCanDelete: boolean = false;

  user$: Observable<User | null> = this.store.select(selectUser);
  private readonly destroy$ = new Subject<void>();

  constructor(private readonly store: Store<any>) {}

  ngOnInit(): void {
    this.user$.subscribe((user) => {
      if (user && this.challenge) {
        if (this.challenge.status === 'PENDING') {
          this.userCanConfirm =
            this.challenge.pendingConfirmationUsers?.includes(user.id) || false;
          this.userCanDelete =
            !this.challenge.pendingConfirmationUsers?.includes(user.id) ||
            false;
        } else if (this.challenge.status === 'ACCEPTED') {
          this.userCanDelete = true;
        } else {
          this.userCanDelete = false;
          this.userCanConfirm = false;
        }
      }
    });

    // Monitor loading state and results for showing loader and messages
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

  onAccept(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres aceptar este reto?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, aceptar',
      cancelButtonText: 'No, cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.store.dispatch(
          acceptChallenge({ challengeId: this.challenge!.id })
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
      if (result.isConfirmed) {
        this.store.dispatch(
          rejectChallenge({ challengeId: this.challenge!.id })
        );
      }
    });
  }

  onDelete(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres eliminar este reto?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.store.dispatch(
          deleteChallenge({ challengeId: this.challenge!.id })
        );
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.store.dispatch(resetChallengeCardState());
  }
}
