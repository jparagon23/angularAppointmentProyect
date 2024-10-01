import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { format, toZonedTime } from 'date-fns-tz';
import { ReservationInfoModalComponent } from '../../modals/reservation-info-modal/reservation-info-modal.component';
import { ClubReservations } from 'src/app/models/ClubReservations.model';
import { Store } from '@ngrx/store';
import { loadReservationsAdmin } from 'src/app/state/actions/reservations.actions';
import { selectUser } from 'src/app/state/selectors/users.selectors';
import { filter, Observable } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { selectClubReservations } from 'src/app/state/selectors/reservetions.selectors';

@Component({
  selector: 'app-admin-dashboard-page',
  templateUrl: './admin-dashboard-page.component.html',
})
export class AdminDashboardPageComponent implements OnInit {
  selectedDate: string = this.initializeSelectedDate();

  // Observable que puede tener ClubReservations o ser null
  reservations$: Observable<ClubReservations | null> = new Observable();

  user: User | undefined;

  constructor(public dialog: MatDialog, private store: Store<any>) {}

  ngOnInit(): void {
    // Filtramos los valores null para asegurarnos de trabajar solo con datos válidos
    this.reservations$ = this.store.select(selectClubReservations).pipe(
      filter((clubReservations) => !!clubReservations) // Filtra los valores null o undefined
    );

    // Suscripción al usuario
    this.store.select(selectUser).subscribe({
      next: (user) => {
        if (user) {
          this.user = user;
          console.log('User data in admin:', user);

          // Despachamos la acción para cargar las reservas del club con la fecha seleccionada
          this.store.dispatch(
            loadReservationsAdmin({
              date: this.selectedDate,
              club: this.user.userAdminClub,
            })
          );
        } else {
          console.error('User is null');
        }
      },
      error: (err) => {
        console.error('Error fetching user:', err);
      },
    });
  }

  // Inicializa la fecha seleccionada en formato YYYY-MM-DD y en la zona horaria de Bogotá
  initializeSelectedDate(): string {
    const today = new Date();
    const bogotaTimeZone = 'America/Bogota';
    const zonedDate = toZonedTime(today, bogotaTimeZone);
    return format(zonedDate, 'yyyy-MM-dd', { timeZone: bogotaTimeZone });
  }

  // Controlador para el cambio de fecha
  onDateChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.selectedDate = inputElement.value;
    console.log(this.selectedDate);

    // Al cambiar la fecha, cargamos nuevamente las reservas para esa fecha
    if (this.user) {
      this.store.dispatch(
        loadReservationsAdmin({
          date: this.selectedDate,
          club: this.user.userAdminClub,
        })
      );
    }
  }

  // Controlador para el clic en una reserva
  onReservationClick(
    reservation: { id: string | null; description: string },
    hour: string
  ): void {
    const reservationInfo = {
      date: this.selectedDate,
      id: reservation.id,
      user: reservation.description,
      hour: hour,
    };

    // Lógica para determinar el tipo de reserva según el ID
    if (reservation.id === '-1') {
      console.log('Reservar');
      return;
    }

    if (reservation.id === '-99') {
      console.log('No disponible');
      return;
    }

    if (reservation.id !== null && reservation.id.startsWith('I')) {
      console.log('Reservado');
      this.dialog.open(ReservationInfoModalComponent, {
        maxWidth: '50vw',
        maxHeight: '50vh',
        data: { reservationInfo },
      });

      return;
    } else {
      console.log('Reserva Grupal');
    }
  }
}
