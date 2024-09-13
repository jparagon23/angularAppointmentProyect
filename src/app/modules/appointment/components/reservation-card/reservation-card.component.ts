import { Component, Input } from '@angular/core';
import { ReservationDetail } from 'src/app/models/UserReservations.model';

@Component({
  selector: 'app-reservation-card',
  templateUrl: './reservation-card.component.html',
})
export class ReservationCardComponent {
  @Input() reservation!: ReservationDetail;
}
