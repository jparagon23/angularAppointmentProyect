import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-page',
  templateUrl: './event-page.component.html',
  styleUrls: ['./event-page.component.css'],
})
export class EventPageComponent {
  suscribirse(categoria: string): void {
    console.log(`Inscripción en la categoría: ${categoria}`);
    // Aquí puedes agregar la lógica de navegación, mostrar un modal, enviar datos a la API, etc.
  }
}
