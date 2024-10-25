import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { format, toZonedTime } from 'date-fns-tz';
import { ReservationInfoModalComponent } from '../../modals/reservation-info-modal/reservation-info-modal.component';
import { ClubReservations } from 'src/app/models/ClubReservations.model';
import { Store } from '@ngrx/store';
import { loadReservationsAdmin } from 'src/app/state/actions/reservations.actions';
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

  currentTime = new Date();

  constructor(public dialog: MatDialog, private readonly store: Store<any>) {}

  ngOnInit(): void {
    this.currentTime = new Date();
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

            // Start the interval to load reservations every 4 minutes
            interval(3 * 60 * 1000)
              .pipe(
                startWith(0), // Trigger immediately on subscription
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
          } else {
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
    const reservationInfo = {
      date: this.selectedDate,
      id: reservation.id,
      user: reservation.description,
      hour: hour,
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
    const currentHour = format(this.currentTime, 'HH:mm');
    return isBefore(
      parse(reservationTime, 'HH:mm', new Date()),
      parse(currentHour, 'HH:mm', new Date())
    );
  }

  // Method to check if the reservation time is the current time slot (current hour)
  isCurrentTimeSlot(reservationTime: string, index: number): boolean {
    const currentHour = format(this.currentTime, 'HH:mm');
    let isCurrentSlot = false;
    this.reservations$.pipe(take(1)).subscribe((reservations) => {
      const nextHour =
        reservations?.reservationsData[index + 1]?.reservations[0]
          ?.description || '';
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
