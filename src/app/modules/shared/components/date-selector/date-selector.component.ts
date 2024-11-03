import { parseISO } from 'date-fns';
import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-date-selector',
  templateUrl: './date-selector.component.html',
  styleUrls: ['./date-selector.component.css'],
  providers: [DatePipe],
})
export class DateSelectorComponent implements OnInit {
  @ViewChild('datePicker') datePicker!: MatDatepicker<Date>;
  @Input() initialDate!: string;
  @Input() minDate!: string;
  @Input() maxDate!: string;
  @Output() dateSelected = new EventEmitter<string>();

  minDateParsed!: Date;
  maxDateParsed!: Date;
  initialDateParsed!: Date;

  // Flags to disable buttons
  isPrevDisabled!: boolean;
  isNextDisabled!: boolean;

  constructor(private readonly datePipe: DatePipe) {}

  ngOnInit(): void {
    this.minDateParsed = parseISO(this.minDate);
    this.maxDateParsed = parseISO(this.maxDate);
    this.initialDateParsed = parseISO(this.initialDate);
    this.updateButtonStates(); // Update button states on init
  }

  get formattedDate(): string {
    return (
      this.datePipe.transform(
        this.initialDateParsed,
        "EEEE, d 'de' MMMM yyyy",
        'es-ES'
      ) ?? ''
    );
  }

  // Cambia el día según el valor (1 para adelante, -1 para atrás)
  changeDay(value: number) {
    this.initialDateParsed.setDate(this.initialDateParsed.getDate() + value);
    this.dateSelected.emit(
      this.datePipe.transform(this.initialDateParsed, 'yyyy-MM-dd') ?? ''
    ); // Emitir la fecha seleccionada
    this.updateButtonStates(); // Update button states after changing the date
  }

  // Update button states based on current date
  updateButtonStates(): void {
    this.isPrevDisabled = this.initialDateParsed <= this.minDateParsed;
    this.isNextDisabled = this.initialDateParsed >= this.maxDateParsed;
  }

  // Abre el date picker
  openDatePicker() {
    this.datePicker.open(); // Llamada directa a open() en el datePicker
  }

  // Evento para manejar el cambio de fecha desde el date picker
  onDateChange(event: any) {
    this.initialDateParsed = event.value;
    this.dateSelected.emit(
      this.datePipe.transform(this.initialDateParsed, 'yyyy-MM-dd') ?? ''
    ); // Emitir la fecha seleccionada
    this.updateButtonStates(); // Update button states after date change
  }
}
