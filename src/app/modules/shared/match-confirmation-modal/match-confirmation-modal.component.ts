import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UserMatch } from 'src/app/models/events/UserMatch.model';
import { NotificationItem } from 'src/app/models/notification/NotificationItem.model';
import { User } from 'src/app/models/user.model';
import { MatchService } from 'src/app/services/match.service';
import {
  confirmMatchResult,
  rejectMatchResult,
  resetMatchResultState,
} from 'src/app/state/actions/event.actions';
import { AppState } from 'src/app/state/app.state';
import {
  selectMatchResultActionStatus,
  selectUserMatches,
} from 'src/app/state/selectors/event.selectors';
import { selectUser } from 'src/app/state/selectors/users.selectors';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-match-confirmation-modal',
  templateUrl: './match-confirmation-modal.component.html',
})
export class MatchConfirmationModalComponent implements OnInit, OnDestroy {
  userMatches$: Observable<UserMatch[]> = this.store.select(selectUserMatches);
  matchId: string | null = null;
  selectedMatch: UserMatch | undefined;

  isLoading: boolean = false;
  confirmationMessage: string = '';
  action: 'confirm' | 'reject' | null = null;

  user$ = this.store.select(selectUser);

  user: User | undefined;

  userWhoPostedMatch: string = '';

  // Seleccionamos el estado de las acciones del resultado del partido desde el store
  MatchResultActionStatus$: Observable<any> = this.store.select(
    selectMatchResultActionStatus
  );

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: NotificationItem,
    private readonly store: Store<AppState>,
    public dialogRef: MatDialogRef<MatchConfirmationModalComponent> // Inyecta MatDialogRef
  ) {}

  ngOnInit(): void {
    this.matchId = this.getMatchId(this.data);

    // Obtener el match y asignarlo
    this.userMatches$.subscribe((matches) => {
      const foundMatch = matches.find(
        (match) => match.matchId === Number(this.matchId)
      );
      if (foundMatch) {
        this.selectedMatch = foundMatch;
      } else {
        console.error('Match not found');
      }
    });

    // Subscribirse a cambios en el estado de la acción de resultado del partido
    this.MatchResultActionStatus$.subscribe((status) => {
      this.isLoading = status.loading;

      if (status.confirmSuccess) {
        this.showSuccessMessage('¡Partido confirmado correctamente!');
      } else if (status.confirmFailure) {
        this.showErrorMessage('Hubo un error al confirmar el partido.');
      }

      if (status.rejectSuccess) {
        this.showSuccessMessage('¡Partido rechazado correctamente!');
      } else if (status.rejectFailure) {
        this.showErrorMessage('Hubo un error al rechazar el partido.');
      }
    });

    this.user$.subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });
  }

  getUserWhoPosted() {
    if (this.selectedMatch?.winner.id === this.user?.id) {
      this.userWhoPostedMatch = this.selectedMatch?.looser.name ?? '';
    } else if (this.selectedMatch?.looser.id === this.user?.id) {
      this.userWhoPostedMatch = this.selectedMatch?.winner.name ?? '';
    }
    return this.userWhoPostedMatch;
  }

  getMatchId(notification: { actionUrl: string }) {
    const regex = /confirm\/(\d+)/;
    const matchId = regex.exec(notification.actionUrl);
    return matchId ? matchId[1] : null;
  }

  confirmMatch() {
    this.action = 'confirm';
    this.showLoading();
    this.store.dispatch(confirmMatchResult({ matchId: Number(this.matchId) }));
  }

  rejectMatch() {
    this.action = 'reject';
    this.showLoading();
    this.store.dispatch(rejectMatchResult({ matchId: Number(this.matchId) }));
  }

  // Mostrar modal de carga
  showLoading() {
    Swal.fire({
      title: 'Cargando...',
      text: 'Por favor espera mientras procesamos la solicitud.',
      allowOutsideClick: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      },
    });
  }

  // Mostrar mensaje de éxito
  showSuccessMessage(message: string) {
    Swal.fire({
      icon: 'success',
      title: message,
      confirmButtonText: 'Aceptar',
    }).then(() => {
      this.dialogRef.close(); // Cierra el modal principal
    });
  }

  // Mostrar mensaje de error
  showErrorMessage(message: string) {
    Swal.fire({
      icon: 'error',
      title: message,
      confirmButtonText: 'Intentar nuevamente',
    });
  }

  ngOnDestroy(): void {
    this.store.dispatch(resetMatchResultState()); // Resetea el estado relacionado con el componente
  }
}
