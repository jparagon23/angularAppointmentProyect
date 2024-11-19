import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizeFirstWord',
})
export class CapitalizeFirstWordPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    // Divide la cadena en palabras
    const words = value.toLowerCase().split(' ');

    // Capitaliza la primera palabra y une el resto
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    return words.join(' ');
  }
}
