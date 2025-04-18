import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MembershipDTO } from 'src/app/models/MembershipDTO.model';
import { ClubService } from 'src/app/services/club.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-membership-card',
  templateUrl: './membership-card.component.html',
})
export class MembershipCardComponent {
  @Input() membership!: MembershipDTO;
  @Output() actionDone = new EventEmitter<MembershipDTO>();

  isLoading = false;

  constructor(private readonly clubService: ClubService) {}

  approve() {
    Swal.fire({
      title: '¿Aprobar solicitud?',
      text: `¿Estás seguro de aprobar a ${this.membership.userName} ${this.membership.userLastname}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, aprobar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#418622',
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.clubService
          .membershipAction(
            this.membership.clubId,
            this.membership.userId,
            'approve'
          )
          .subscribe({
            next: () => {
              this.isLoading = false;
              Swal.fire('¡Aprobado!', 'La solicitud fue aprobada.', 'success');
              this.actionDone.emit(this.membership);
            },
            error: () => {
              this.isLoading = false;
              this.showErrorModal();
            },
          });
      }
    });
  }

  reject() {
    Swal.fire({
      title: '¿Rechazar solicitud?',
      text: `¿Estás seguro de rechazar a ${this.membership.userName} ${this.membership.userLastname}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, rechazar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.clubService
          .membershipAction(
            this.membership.clubId,
            this.membership.userId,
            'reject'
          )
          .subscribe({
            next: () => {
              this.isLoading = false;
              Swal.fire('Rechazado', 'La solicitud fue rechazada.', 'info');
              this.actionDone.emit(this.membership);
            },
            error: () => {
              this.isLoading = false;
              this.showErrorModal();
            },
          });
      }
    });
  }

  private showErrorModal() {
    Swal.fire({
      icon: 'error',
      title: 'Error inesperado',
      text: 'Ocurrió un error al procesar la solicitud. Por favor, intenta nuevamente.',
      confirmButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
    });
  }
}
