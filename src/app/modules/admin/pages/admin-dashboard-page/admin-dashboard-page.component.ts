import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { format, toZonedTime } from 'date-fns-tz';
import { ReservationInfoModalComponent } from '../../modals/reservation-info-modal/reservation-info-modal.component';
import { ClubReservations } from 'src/app/models/ClubReservations.model';
import { Store } from '@ngrx/store';
import {
  loadCancelReservationCauses,
  loadReservationsAdmin,
} from 'src/app/state/actions/reservations.actions';
import { selectUser } from 'src/app/state/selectors/users.selectors';
import {
  filter,
  Observable,
  catchError,
  of,
  Subject,
  takeUntil,
  take,
  interval,
  startWith,
  switchMap,
} from 'rxjs';
import { User } from 'src/app/models/user.model';
import {
  selectClubReservations,
  selectClubReservationsLoading,
} from 'src/app/state/selectors/reservetions.selectors';
import { GroupReservationInfoModalComponent } from '../../modals/group-reservation-info-modal/group-reservation-info-modal.component';
import { CreateReservationFromTableModalComponent } from '../../modals/create-reservation-from-table-modal/create-reservation-from-table-modal.component';

import { parse, isBefore, isAfter } from 'date-fns';

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
  private readonly destroy$ = new Subject<void>();
  private loadIntervalSet = false;

  currentTime = new Date();

  constructor(public dialog: MatDialog, private readonly store: Store<any>) {}

  isPastTimes: boolean[] = [];
  isCurrentTimeSlots: boolean[] = [];

  ngOnInit(): void {
    this.currentTime = new Date();

    this.store.dispatch(loadCancelReservationCauses());
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
            this.selectedDate = this.initializeSelectedDate();
            this.loadReservations();

            // Suscripción a las reservas y asignación de valores a `isPastTimes` y `isCurrentTimeSlots`
            this.reservations$
              .pipe(takeUntil(this.destroy$))
              .subscribe((reservations) => {
                if (reservations) {
                  this.isPastTimes = reservations.reservationsData.map((row) =>
                    this.isPastTime(row.reservations[0].description)
                  );
                  this.isCurrentTimeSlots = reservations.reservationsData.map(
                    (row, index) =>
                      this.isCurrentTimeSlot(
                        row.reservations[0].description,
                        index
                      )
                  );
                }
              });

            if (!this.loadIntervalSet) {
              this.loadIntervalSet = true;
              interval(3 * 60 * 1000)
                .pipe(
                  startWith(0),
                  takeUntil(this.destroy$),
                  switchMap(() => this.store.select(selectUser).pipe(take(1)))
                )
                .subscribe((user) => {
                  if (user) {
                    this.loadReservations();
                  } else {
                    console.error('User is null during interval');
                  }
                });
            }
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
    return format(zonedDate, 'yyyy-MM-dd', {
      timeZone: bogotaTimeZone,
    });
  }

  onDateChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.selectedDate = inputElement.value;
    this.loadReservations();
  }

  loadReservations(): void {
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
    // Combine selectedDate and hour into a single datetime string
    const formattedHour = hour.length < 5 ? `0${hour}` : hour;
    const combinedDateTime = `${this.selectedDate}T${formattedHour}:00`;

    const reservationInfo = {
      date: this.selectedDate,
      id: reservation.id,
      user: reservation.description,
      hour: combinedDateTime,
    };

    if (reservation.id === '-1') {
      this.dialog.open(CreateReservationFromTableModalComponent, {
        maxWidth: '50vw',
        maxHeight: '50vh',
        data: { reservationInfo },
      });
      return;
    }

    if (reservation.id === '-99') {
      return;
    }

    if (reservation.id?.startsWith('I')) {
      this.dialog.open(ReservationInfoModalComponent, {
        maxWidth: '50vw',
        maxHeight: '50vh',
        data: { reservationInfo },
      });
    } else {
      this.dialog.open(GroupReservationInfoModalComponent, {
        maxWidth: '50vw',
        maxHeight: '50vh',
        data: { reservationInfo },
      });
    }
  }

  // Method to check if the reservation time is in the past
  isPastTime(reservationTime: string): boolean {
    const fonmatSelectedDate = this.selectedDate;

    const today = new Date();
    const bogotaTimeZone = 'America/Bogota';
    const zonedDate = toZonedTime(today, bogotaTimeZone);
    const currentDate = format(zonedDate, 'yyyy-MM-dd', {
      timeZone: bogotaTimeZone,
    });

    if (fonmatSelectedDate > currentDate) {
      return false;
    } else if (fonmatSelectedDate < currentDate) {
      return true;
    } else {
      const currentHour = format(this.currentTime, 'HH:mm');
      return isBefore(
        parse(reservationTime, 'HH:mm', new Date()),
        parse(currentHour, 'HH:mm', new Date())
      );
    }
  }

  // Method to check if the reservation time is the current time slot (current hour)
  isCurrentTimeSlot(reservationTime: string, index: number): boolean {
    const today = new Date();
    const bogotaTimeZone = 'America/Bogota';
    const zonedDate = toZonedTime(today, bogotaTimeZone);
    const currentDate = format(zonedDate, 'yyyy-MM-dd', {
      timeZone: bogotaTimeZone,
    });
    const fonmatSelectedDate = this.selectedDate;
    if (fonmatSelectedDate > currentDate) {
      return false;
    } else if (fonmatSelectedDate < currentDate) {
      return false;
    } else {
      const currentHour = format(this.currentTime, 'HH:mm');
      let isCurrentSlot = false;
      this.reservations$.pipe(take(1)).subscribe((reservations) => {
        const nextHour =
          reservations?.reservationsData[index + 1]?.reservations[0]
            ?.description ?? '';
        isCurrentSlot =
          isAfter(
            parse(currentHour, 'HH:mm', new Date()),
            parse(reservationTime, 'HH:mm', new Date())
          ) &&
          isBefore(
            parse(currentHour, 'HH:mm', new Date()),
            parse(nextHour, 'HH:mm', new Date())
          );
      });
      return isCurrentSlot;
    }
  }
}
