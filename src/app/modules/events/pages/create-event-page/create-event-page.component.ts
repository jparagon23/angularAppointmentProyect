import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-event-page',
  templateUrl: './create-event-page.component.html',
  styleUrls: ['./create-event-page.component.css']
})
export class CreateEventPageComponent {

  eventForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.eventForm = this.fb.group({
      nombre: ['', Validators.required],
      ubicacion: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      registroInicio: ['', Validators.required],
      registroFin: ['', Validators.required],
      categorias: this.fb.array([this.crearCategoria()])
    });
  }

  // Acceso rápido al FormArray de categorías
  get categorias(): FormArray {
    return this.eventForm.get('categorias') as FormArray;
  }

  // Acceso rápido al FormArray de premios de una categoría
  getPremios(categoriaIndex: number): FormArray {
    return this.categorias.at(categoriaIndex).get('premios') as FormArray;
  }

  // Crea una nueva categoría con campos iniciales
  crearCategoria(): FormGroup {
    return this.fb.group({
      nombre: ['', Validators.required],
      genero: ['Masculino', Validators.required],
      precio: [0, [Validators.required, Validators.min(0)]],
      formato: ['Sencillos', Validators.required],
      premios: this.fb.array([this.crearPremio()]),
      maxJugadores: [0, Validators.min(0)],
      rangoEdad: [100, Validators.min(0)],
      rangoRanking: [6, Validators.min(0)]
    });
  }

  // Crea un nuevo premio dentro de una categoría
  crearPremio(): FormGroup {
    return this.fb.group({
      posicion: ['1er Lugar', Validators.required],
      descripcion: ['']
    });
  }

  // Agrega una nueva categoría al formulario
  agregarCategoria(): void {
    this.categorias.push(this.crearCategoria());
  }

  // Agrega un premio a la categoría correspondiente
  agregarPremio(categoriaIndex: number): void {
    this.getPremios(categoriaIndex).push(this.crearPremio());
  }

  // Enviar formulario
  onSubmit(): void {
    if (this.eventForm.valid) {
      console.log('Formulario enviado:', this.eventForm.value);
      // Aquí puedes hacer el envío al backend
    } else {
      console.log('Formulario inválido');
      this.eventForm.markAllAsTouched();
    }
  }
}
