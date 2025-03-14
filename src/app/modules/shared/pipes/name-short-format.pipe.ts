import { Pipe, PipeTransform } from '@angular/core';
import { getFormattedName } from 'src/app/utils/funcitons';

@Pipe({
  name: 'nameShortFormat',
})
export class NameShortFormatPipe implements PipeTransform {
  transform(fullName: string, fullLastName: string): string {
    return getFormattedName(fullName, fullLastName);
  }
}
