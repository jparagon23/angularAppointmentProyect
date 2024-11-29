import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { format, toZonedTime } from 'date-fns-tz';
import { ReservationInfoModalComponent } from '../../modals/reservation-info-modal/reservation-info-modal.component';
import {
  ClubReservations,
  Reservation,
} from 'src/app/models/ClubReservations.model';
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
import { loadCourts } from 'src/app/state/actions/clubConfiguration.actions';
import { selectedClubDate } from 'src/app/state/actions/club.actions';

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

  mousedownStartTime: number = 0;

  isDragging = false;
  currentTime = new Date();
  hasMoved: boolean = false;

  constructor(public dialog: MatDialog, private readonly store: Store<any>) {}

  isPastTimes: boolean[] = [];
  isCurrentTimeSlots: boolean[] = [];

  selectedSlots: { hour: string; courtId: string }[] = [];

  ngOnInit(): void {
    this.currentTime = new Date();
    this.store.dispatch(loadCourts());
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

  onDateChange(date: string): void {
    this.selectedDate = date;
    this.loadReservations();
    this.store.dispatch(selectedClubDate({ date: this.selectedDate }));
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

  onReservationClick(reservation: Reservation, hour: string): void {
    // Combine selectedDate and hour into a single datetime string
    const formattedHour = hour.length < 5 ? `0${hour}` : hour;
    const combinedDateTime = `${this.selectedDate}T${formattedHour}:00`;

    const reservationInfo = {
      date: this.selectedDate,
      id: reservation.id,
      user: reservation.description,
      hour: [combinedDateTime],
      courtId: reservation.courtId,
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

  onMouseDown(reservation: Reservation, hour: any): void {
    this.mousedownStartTime = Date.now(); // Tiempo en el que comienza el mousedown
    this.hasMoved = false; // Reinicia el estado de movimiento

    if (reservation.description === 'Disponible') {
      this.isDragging = true; // Activa el estado de arrastre
      this.toggleSlotSelection(reservation, hour); // Selecciona el slot inicial
    }
  }

  onMouseEnter(reservation: Reservation, hour: any): void {
    this.hasMoved = true; // Marca que hubo movimiento
    if (this.isDragging && reservation.description === 'Disponible') {
      this.toggleSlotSelection(reservation, hour); // Selecciona el slot durante el arrastre
    }
  }

  onMouseUp(): void {
    const clickDuration = Date.now() - this.mousedownStartTime;

    if (this.hasMoved && clickDuration > 200) {
      this.isDragging = false;

      const hours = this.selectedSlots.map((slot) => slot.hour);
      const courtId = this.selectedSlots[0].courtId;

      const reservationInfo = {
        date: this.selectedDate,
        id: '-1',
        user: null,
        hour: hours,
        courtId: courtId,
      };

      this.dialog.open(CreateReservationFromTableModalComponent, {
        maxWidth: '50vw',
        maxHeight: '50vh',
        data: { reservationInfo },
      });
    }

    this.selectedSlots = [];
  }

  toggleSlotSelection(reservation: Reservation, hour: any): void {
    const formattedHour = hour.length < 5 ? `0${hour}` : hour;
    const combinedDateTime = `${this.selectedDate}T${formattedHour}:00`;

    // Verifica si ya hay slots seleccionados
    if (this.selectedSlots.length > 0) {
      const selectedCourtId = this.selectedSlots[0].courtId; // Usa el courtId del primer slot seleccionado
      if (reservation.courtId?.toString() !== selectedCourtId) {
        console.warn(`Solo se pueden seleccionar horas en la misma cancha`);
        return; // Evita agregar el slot si no coincide el courtId
      }
    }

    const existingSlot = this.selectedSlots.find(
      (slot) => slot.hour === combinedDateTime
    );
    if (existingSlot) {
      // Si ya existe, lo eliminamos
      this.selectedSlots = this.selectedSlots.filter(
        (slot) => slot.hour !== combinedDateTime
      );
    } else {
      // Si no existe, lo agregamos
      this.selectedSlots.push({
        hour: combinedDateTime,
        courtId: reservation.courtId ? reservation.courtId.toString() : '',
      });
    }
  }

  isSlotSelected(reservation: Reservation, hour: any): boolean {
    const formattedHour = hour.length < 5 ? `0${hour}` : hour;
    return this.selectedSlots.some(
      (slot) =>
        slot.hour === `${this.selectedDate}T${formattedHour}:00` &&
        slot.courtId === reservation.courtId?.toString()
    );
  }

  @HostListener('document:mouseup')
  onDocumentMouseUp(): void {
    this.isDragging = false;
  }

  @HostListener('document:mousedown', ['$event'])
  preventTextSelection(event: MouseEvent): void {
    if (this.isDragging) {
      event.preventDefault();
    }
  }
}
