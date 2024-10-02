import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormat',
})
export class TimeFormatPipe implements PipeTransform {
  transform(value: Date | string, format: string = 'H:mm'): string {
    const date = new Date(value);
    const hours = date.getHours().toString();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    console.log(`${hours}:${minutes}`);

    return `${hours}:${minutes}`;
  }
}
