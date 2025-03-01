import { faEye } from '@fortawesome/free-solid-svg-icons';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store'; // Importamos Store de NgRx
import { User, UserMatch } from 'src/app/models/events/UserMatch.model';
import {
  confirmMatchResult,
  deleteMatchResult,
  rejectMatchResult,
  resetMatchResultState,
} from 'src/app/state/actions/event.actions';
import Swal from 'sweetalert2';
import { selectUser } from 'src/app/state/selectors/users.selectors';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AppState } from 'src/app/state/app.state';
import { selectMatchResultActionStatus } from 'src/app/state/selectors/event.selectors';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-match-result-card',
  templateUrl: './match-result-card.component.html',
})
export class MatchResultCardComponent implements OnInit, OnDestroy {
  @Input() matchData!: UserMatch;
  @Input() userCanConfirm: boolean = false;

  canDelete: boolean = false;

  user$: Observable<User | null> = this.store.select(selectUser);

  matchActions$ = this.store.select(selectMatchResultActionStatus);

  private readonly destroy$ = new Subject<void>();

  userId!: number;

  constructor(
    private readonly store: Store<AppState>,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.user$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      if (
        user &&
        this.matchData.pendingConfirmationUsers &&
        this.matchData.status === 'PENDING'
      ) {
        this.canDelete = !this.matchData.pendingConfirmationUsers.includes(
          user.id
        );
        this.userId = user.id;
      } else {
        this.canDelete = false;
        this.userId = user?.id ?? 0;
      }
    });

    // Monitor loading state and results for showing loader and messages
    this.matchActions$.pipe(takeUntil(this.destroy$)).subscribe((status) => {
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
          Swal.fire('¡Éxito!', 'El partido ha sido aceptado.', 'success');
        } else if (status.confirmFailure) {
          Swal.fire('Error', 'No se pudo aceptar el partido.', 'error');
        }

        if (status.rejectSuccess) {
          Swal.fire('¡Éxito!', 'El partido ha sido rechazado.', 'success');
        } else if (status.rejectFailure) {
          Swal.fire('Error', 'No se pudo rechazar el partido.', 'error');
        }

        if (status.deleteSuccess) {
          Swal.fire('¡Éxito!', 'El partido ha sido eliminado.', 'success');
        } else if (status.deleteFailure) {
          Swal.fire('Error', 'No se pudo eliminar el partido.', 'error');
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.store.dispatch(resetMatchResultState());
    this.destroy$.next();
    this.destroy$.complete();
  }

  onAccept(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres aceptar este partido?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, aceptar',
      cancelButtonText: 'No, cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        // Despachamos la acción de aceptación
        this.store.dispatch(
          confirmMatchResult({ matchId: this.matchData.matchId })
        );
      }
    });
  }

  onReject(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres rechazar este partido?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, rechazar',
      cancelButtonText: 'No, cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        // Despachamos la acción de rechazo
        this.store.dispatch(
          rejectMatchResult({ matchId: this.matchData.matchId })
        );
      }
    });
  }

  onDelete(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres eliminar este partido?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.store.dispatch(
          deleteMatchResult({ matchId: this.matchData.matchId })
        );
      }
    });
  }

  onUserClick(userId: number): void {
    // Detectamos si la URL actual tiene "admin" o "user"
    const path = this.route.snapshot.url.map((segment) => segment.path);
    const basePath = path.includes('admin') ? 'admin' : 'user';

    // Redirigir dinámicamente
    this.router.navigateByUrl(`/home/${basePath}/profile/${userId}`);
  }
}
