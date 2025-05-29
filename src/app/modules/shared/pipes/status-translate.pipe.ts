import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusTranslate',
})
export class StatusTranslatePipe implements PipeTransform {
  private statusMap: { [key: string]: string } = {
    PENDING: 'PENDIENTE',
    CONFIRMED: 'CONFIRMADO',
    REJECTED: 'RECHAZADO',
    AUTO_APPROVED: 'CONFIRMADO',
    CANCELLED: 'CANCELADO',
  };

  transform(value: string): string {
    return this.statusMap[value] || value;
  }
}
