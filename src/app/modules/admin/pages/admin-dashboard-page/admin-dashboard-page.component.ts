import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { format, toZonedTime } from 'date-fns-tz';
import { ReservationInfoModalComponent } from '../../modals/reservation-info-modal/reservation-info-modal.component';
import { ClubReservations } from 'src/app/models/ClubReservations.model';
import { Store } from '@ngrx/store';
import { loadReservationsAdmin } from 'src/app/state/actions/reservations.actions';
import { selectUser } from 'src/app/state/selectors/users.selectors';
import { filter, Observable, catchError, of, Subject, takeUntil } from 'rxjs';
import { User } from 'src/app/models/user.model';
import {
  selectClubReservations,
  selectClubReservationsLoading,
} from 'src/app/state/selectors/reservetions.selectors';
import { GroupReservationInfoModalComponent } from '../../modals/group-reservation-info-modal/group-reservation-info-modal.component';
import { CreateReservationFromTableModalComponent } from '../../modals/create-reservation-from-table-modal/create-reservation-from-table-modal.component';

@Component({
  selector: 'app-admin-dashboard-page',
  templateUrl: './admin-dashboard-page.component.html',
})
export class AdminDashboardPageComponent implements OnInit, OnDestroy {
  selectedDate: string = this.initializeSelectedDate();
  reservations$: Observable<ClubReservations | null> = new Observable();
  clubReservationLoading$: Observable<boolean> = new Observable();
  user: User | undefined;
  error: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(public dialog: MatDialog, private store: Store<any>) {}

  ngOnInit(): void {
    this.reservations$ = this.store.select(selectClubReservations).pipe(
      filter((clubReservations) => !!clubReservations),
      catchError((err) => {
        console.error('Error fetching reservations:', err);
        this.error = true;
        return of(null);
      }),
      takeUntil(this.destroy$)
    );

    this.clubReservationLoading$ = this.store
      .select(selectClubReservationsLoading)
      .pipe(takeUntil(this.destroy$));

    this.store
      .select(selectUser)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user) => {
          if (user) {
            this.user = user;
            console.log('User data in admin:', user);
            this.loadReservations();
          } else {
            console.error('User is null');
          }
        },
        error: (err) => {
          console.error('Error fetching user:', err);
          this.error = true;
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initializeSelectedDate(): string {
    const today = new Date();
    const bogotaTimeZone = 'America/Bogota';
    const zonedDate = toZonedTime(today, bogotaTimeZone);
    return format(zonedDate, 'yyyy-MM-dd', { timeZone: bogotaTimeZone });
  }

  onDateChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.selectedDate = inputElement.value;
    console.log(this.selectedDate);
    this.loadReservations();
  }

  loadReservations(): void {
    console.log('Desde el admin-dashboard lanzando el loadReservations');

    if (this.user) {
      this.store.dispatch(
        loadReservationsAdmin({
          date: this.selectedDate,
        })
      );
    }
  }

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

    if (reservation.id === '-1') {
      console.log('Reserva Grupal');
      this.dialog.open(CreateReservationFromTableModalComponent, {
        maxWidth: '50vw',
        maxHeight: '50vh',
        data: { reservationInfo },
      });
      return;
    }

    if (reservation.id === '-99') {
      console.log('No disponible');
      return;
    }

    if (reservation.id !== null && reservation.id.startsWith('I')) {
      console.log('Reserva individual');
      this.dialog.open(ReservationInfoModalComponent, {
        maxWidth: '50vw',
        maxHeight: '50vh',
        data: { reservationInfo },
      });
      return;
    } else {
      console.log('Reserva Grupal');
      this.dialog.open(GroupReservationInfoModalComponent, {
        maxWidth: '50vw',
        maxHeight: '50vh',
        data: { reservationInfo },
      });
    }
  }
}
