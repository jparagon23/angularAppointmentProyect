import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusTranslate',
})
export class StatusTranslatePipe implements PipeTransform {
  private readonly statusMap: { [key: string]: string } = {
    PENDING: 'PENDIENTE',
    CONFIRMED: 'CONFIRMADO',
    REJECTED: 'RECHAZADO',
    AUTO_APPROVED: 'CONFIRMADO',
    CANCELLED: 'CANCELADO',
    SINGLES: 'SENCILLOS',
    DOUBLES: 'DOBLES',
    ACCEPTED: 'ACEPTADO',
    COMPLETED: 'COMPLETADO',
    EXPIRED: 'EXPIRADO',
  };

  transform(value: string): string {
    return this.statusMap[value] || value;
  }
}
