import { Pipe, PipeTransform } from '@angular/core';
import { parseISO } from 'date-fns';

@Pipe({
  name: 'timeFormat',
})
export class TimeFormatPipe implements PipeTransform {
  transform(
    value: string,
    format: 'short' | 'medium' | 'long' = 'long'
  ): string {
    if (!value) return '';

    // Parse the date string using parseISO
    const date = parseISO(value);

    // Check if the date is valid
    if (isNaN(date.getTime())) return '';

    // Define format options based on the parameter
    const formatOptions: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
    };

    if (format === 'medium') {
      // Format options for medium: weekday, day, and abbreviated month
      formatOptions.month = 'short'; // Keep the month abbreviated
      // The weekday is already set to long, so no changes needed
    } else if (format === 'short') {
      delete formatOptions.weekday; // e.g., "28 de Oct"
    } else if (format === 'long') {
      formatOptions.year = 'numeric'; // e.g., "Sábado, 28 de octubre de 2023"
    }

    // Use Intl.DateTimeFormat with selected format options
    const formatter = new Intl.DateTimeFormat('es-ES', formatOptions);

    // Format the date
    const formattedDate = formatter.format(date);

    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }
}
