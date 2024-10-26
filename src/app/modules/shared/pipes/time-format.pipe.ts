import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormat',
})
export class TimeFormatPipe implements PipeTransform {
  transform(value: string): string {
    // Verifica que el valor no sea nulo o indefinido
    if (!value) return '';

    // Dividir la cadena en espacio y tomar la segunda parte
    const parts = value.split(' ');

    // Si hay un espacio, devolver la hora (parte antes de am/pm)
    return parts.length > 1 ? parts[1] + parts[2] : value;
  }
}
