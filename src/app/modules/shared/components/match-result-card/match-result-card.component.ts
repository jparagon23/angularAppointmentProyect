import { Component, Input, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store'; // Importamos Store de NgRx
import { UserMatch } from 'src/app/models/events/UserMatch.model';
import {
  confirmMatchResult,
  rejectMatchResult,
  resetMatchResultState,
} from 'src/app/state/actions/event.actions';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-match-result-card',
  templateUrl: './match-result-card.component.html',
})
export class MatchResultCardComponent implements OnDestroy {
  @Input() matchData!: UserMatch;
  @Input() userCanConfirm: boolean = false; // Nueva propiedad para verificar si puede confirmar

  constructor(private readonly store: Store) {}
  ngOnDestroy(): void {
    this.store.dispatch(resetMatchResultState());
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
        Swal.fire('¡Aceptado!', 'El partido ha sido aceptado.', 'success');
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
        Swal.fire('¡Rechazado!', 'El partido ha sido rechazado.', 'error');
      }
    });
  }
}
