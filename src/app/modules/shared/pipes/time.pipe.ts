import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hourTimeFormat',
})
export class TimePipe implements PipeTransform {
  transform(value: string): string {
    console.log('pipe fecha');

    // Verifica que el valor no sea nulo o indefinido
    if (!value) return '';

    // Parsear la fecha
    const date = new Date(value);
    console.log('la fecha parseada es: ', date);

    // Comprobar si la fecha es válida
    if (isNaN(date.getTime())) return '';

    // Formatear la fecha
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };

    const formattedDate = date.toLocaleString('en-US', options);

    console.log('la fecha formateada es: ', formattedDate);

    // Dividir la cadena formateada para obtener la hora
    const [datePart, timePart] = formattedDate.split(', ');

    // Retornar solo la parte de la hora
    return timePart; // Esto dará "01:00 PM" o similar, dependiendo de la fecha de entrada
  }
}
