import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fullDateFormat',
})
export class FullDateFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    // Parse the date string
    const date = new Date(value);

    // Check if the date is valid
    if (isNaN(date.getTime())) return '';

    // Use Intl.DateTimeFormat for the specific format
    const formatter = new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    // Format the date
    const formattedDate = formatter.format(date);

    // Capitalize the first letter
    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }
}
