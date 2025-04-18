import { Component, Input, OnInit } from '@angular/core';
import { MembershipDTO } from 'src/app/models/MembershipDTO.model';
import { ClubService } from 'src/app/services/club.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-club-members-table',
  templateUrl: './club-members-table.component.html',
})
export class ClubMembersTableComponent implements OnInit {
  @Input() clubId: string | null = null;
  clubMembers: MembershipDTO[] = [];

  constructor(private readonly clubService: ClubService) {}

  ngOnInit(): void {
    if (this.clubId !== null) {
      const clubIdNumber = Number(this.clubId);
      this.clubService.getAllActiveClubMembers(clubIdNumber).subscribe({
        next: (members) => {
          this.clubMembers = members;
        },
        error: () => {
          Swal.fire('Error', 'No se pudo cargar la lista de socios.', 'error');
        },
      });
    }
  }

  removeMembership(userId: number): void {
    if (!this.clubId) return;

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará al usuario del club.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.clubService
          .unsubscribeToClub(Number(this.clubId), userId)
          .subscribe({
            next: () => {
              this.clubMembers = this.clubMembers.filter(
                (member) => member.userId !== userId
              );
              Swal.fire(
                'Eliminado',
                'El usuario ha sido eliminado del club.',
                'success'
              );
            },
            error: () => {
              Swal.fire(
                'Error',
                'No se pudo eliminar al usuario. Intenta nuevamente.',
                'error'
              );
            },
          });
      }
    });
  }
}
