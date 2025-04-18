import { Component, Input, OnInit } from '@angular/core';
import { MatchService } from 'src/app/services/match.service';
import { Observable } from 'rxjs';
import {
  UserMatch,
  UserMatchResponse,
} from 'src/app/models/events/UserMatch.model';

@Component({
  selector: 'app-club-matches-section',
  templateUrl: './club-matches-section.component.html',
})
export class ClubMatchesSectionComponent implements OnInit {
  @Input() clubId: string | null = null; // El clubId es de tipo string o null

  matches$: Observable<UserMatchResponse> = new Observable(); // Observable para el response del servicio
  matchesList: UserMatch[] = []; // Lista de partidos (matchResponseDTOList)
  page: number = 0;
  size: number = 10;

  constructor(private readonly matchService: MatchService) {}

  ngOnInit(): void {
    this.loadMatches();
  }

  // Método para cargar los partidos
  loadMatches(): void {
    this.matches$ = this.matchService.getClubMatches(
      this.clubId ? Number(this.clubId) : undefined, // Convertimos clubId a number si no es null
      'ALL', // Tipo de partido: 'ALL'
      null, // status opcional: null si no se pasa
      this.page, // Página actual
      this.size, // Tamaño de la página
      'match_date', // Ordenar por fecha de partido
      'desc' // Dirección de ordenamiento
    );

    // Suscripción a la respuesta para actualizar los partidos
    this.matches$.subscribe((response: UserMatchResponse) => {
      this.matchesList = response._embedded.matchResponseDTOList; // Asignar los partidos
    });
  }

  // Método para manejar el cambio de página
  onPageChange(page: number): void {
    this.page = page; // Actualizamos la página actual
    this.loadMatches(); // Cargamos los partidos de la nueva página
  }
}
