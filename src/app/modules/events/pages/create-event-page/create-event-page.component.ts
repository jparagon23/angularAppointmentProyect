import { Component } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CommonType } from 'src/app/models/InitialSignUpData.interface';

@Component({
  selector: 'app-create-event-page',
  templateUrl: './create-event-page.component.html',
  styleUrls: ['./create-event-page.component.css'],
})
export class CreateEventPageComponent {
  eventForm: FormGroup;

  genderOptions: CommonType[] = [
    { id: 'M', description: 'Masculino' },
    { id: 'F', description: 'Femenino' },
    { id: 'MX', description: 'Mixto' },
  ];

  prizesPositions: CommonType[] = [
    { id: 1, description: '1er lugar' },
    { id: 2, description: '2do lugar' },
    { id: 3, description: '3er lugar' },
    { id: 4, description: '4to lugar' },
  ];

  eventTypes: CommonType[] = [
    { id: 1, description: 'Round Robin' },
    { id: 2, description: 'Eliminación directa' },
    { id: 3, description: 'Round robin + eliminación directa' }
  ];

  minInitialDate: string = new Date().toISOString().split('T')[0];

  rangoEdad: number = 25; // valor por defecto

  constructor(private readonly fb: FormBuilder) {
    this.eventForm = this.fb.group(
      {
        eventType:['',Validators.required],
        name: ['', Validators.required],
        location: ['', Validators.required],
        eventDescription: ['', Validators.required],
        initialEventDate: ['', Validators.required],
        endEventDate: ['', Validators.required],
        initialRegisterDate: ['', Validators.required],
        endRegisterDate: ['', Validators.required],
        categories: this.fb.array([this.createCategory()]),
      },
      { validators: this.validateDates }
    );

    this.eventForm.get('initialEventDate')?.valueChanges.subscribe((value) => {
      if (value) {
        const eventDate = new Date(value);
        const oneDayBefore = new Date(eventDate);
        oneDayBefore.setDate(eventDate.getDate() - 1);

        const isoDate = oneDayBefore.toISOString().split('T')[0];
        this.eventForm.get('endRegisterDate')?.setValue(isoDate);
      }
    });
  }

  validateDates(control: AbstractControl): null {
    const group = control as FormGroup;

    const endEventDate = new Date(group.get('endEventDate')?.value);
    const initialRegisterDateControl = group.get('initialRegisterDate');
    const endRegisterDateControl = group.get('endRegisterDate');

    if (
      !initialRegisterDateControl ||
      !endRegisterDateControl ||
      !endEventDate
    ) {
      return null;
    }

    const initialRegisterDate = new Date(initialRegisterDateControl.value);
    const endRegisterDate = new Date(endRegisterDateControl.value);

    // Limpiar errores anteriores
    initialRegisterDateControl.setErrors(null);
    endRegisterDateControl.setErrors(null);

    // Validación: initialRegisterDate > endEventDate
    if (initialRegisterDate > endEventDate) {
      initialRegisterDateControl.setErrors({ dateAfterEnd: true });
    }

    // Validación: endRegisterDate > endEventDate
    if (endRegisterDate > endEventDate) {
      endRegisterDateControl.setErrors({ dateAfterEnd: true });
    }

    return null; // no error a nivel de formulario
  }

  // Acceso rápido al FormArray de categorías
  get categories(): FormArray {
    return this.eventForm.get('categories') as FormArray;
  }

  // Acceso rápido al FormArray de premios de una categoría
  getPrizes(categoryIndex: number): FormArray {
    return this.categories.at(categoryIndex).get('categoryPrizes') as FormArray;
  }

  get nameControl(): FormControl {
    return this.eventForm.get('name') as FormControl;
  }

  getControl(name: string): FormControl | null {
    const control = this.eventForm.get(name);
    return control instanceof FormControl ? control : null;
  }

  getCategoryControl(index: number, controlName: string): FormControl | null {
    const group = this.categories.at(index) as FormGroup;
    const control = group.get(controlName);
    return control instanceof FormControl ? control : null;
  }

  getPrizeControl(
    categoryIndex: number,
    prizeIndex: number,
    controlName: string
  ): FormControl | null {
    const prizeGroup = this.getPrizes(categoryIndex).at(
      prizeIndex
    ) as FormGroup;

    const control = prizeGroup.get(controlName);

    return control instanceof FormControl ? control : null;
  }

  // Crea una nueva categoría con campos iniciales
  createCategory(): FormGroup {
    return this.fb.group({
      categoryName: ['', Validators.required],
      categoryGender: ['M', Validators.required],
      categoryPrice: [0, [Validators.required, Validators.min(0)]],
      categoryFormat: ['Sencillos', Validators.required],
      categoryPrizes: this.fb.array([]),
      CategoryMaxPlayers: [0, Validators.min(0)],
    });
  }

  // Crea un nuevo premio dentro de una categoría
  createPrice(position: number = 1): FormGroup {
    return this.fb.group({
      position: [position, Validators.required],
      description: [''],
    });
  }

  // Agrega una nueva categoría al formulario
  addCategory(): void {
    this.categories.push(this.createCategory());
  }
  deleteCategory(index: number): void {
    this.categories.removeAt(index);
  }

  // Agrega un premio a la categoría correspondiente
  addPrize(categoriaIndex: number): void {
    const premios = this.getPrizes(categoriaIndex);
    const nextPosition = premios.length + 1;
    premios.push(this.createPrice(nextPosition));
  }

  deletePrize(i: number, j: number) {
    const premios = this.getPrizes(i);
    if (premios.length > 0) {
      premios.removeAt(j);
    }
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

  isInvalidAndTouched(controlName: string): boolean {
    const control = this.eventForm.get(controlName);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }
}
