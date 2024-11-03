import { Component, Input, OnInit } from '@angular/core';
import { CourtDetail } from 'src/app/models/CourtDetail.model';

@Component({
  selector: 'app-court-card-component',
  templateUrl: './court-card-component.component.html',
})
export class CourtCardComponentComponent implements OnInit {
  @Input() court!: CourtDetail;

  isEditing = false;
  courtName!: string; // Nombre inicial de la cancha
  startTime!: string; // Valor inicial de hora de inicio
  endTime!: string; // Valor inicial de hora de fin

  ngOnInit() {
    this.courtName = this.court.name;
    this.startTime = this.court.initialHour;
    this.endTime = this.court.lastHour;
  }

  // Cambia al modo de edición
  toggleEdit() {
    this.isEditing = true;
  }

  // Guarda los cambios y sale del modo de edición
  saveChanges() {
    this.isEditing = false;
  }

  cancelEdit() {
    this.isEditing = false;
    // Restaura el nombre de la cancha y las horas al estado original si es necesario
    this.courtName = this.court.name;
    this.startTime = this.court.initialHour;
    this.endTime = this.court.lastHour;
  }

  deleteCourt() {
    // Lógica para eliminar la cancha
  }
}
