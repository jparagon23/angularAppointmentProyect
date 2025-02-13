import { Component, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { format, toZonedTime } from 'date-fns-tz';
import {
  catchError,
  filter,
  interval,
  Observable,
  of,
  startWith,
  Subject,
  switchMap,
  take,
  takeUntil,
} from 'rxjs';
import {
  ClubReservations,
  Reservation,
} from 'src/app/models/ClubReservations.model';
import { CourtDetail } from 'src/app/models/CourtDetail.model';
import { UpdateReservationDto } from 'src/app/models/UpdateReservationDto.model';
import { User } from 'src/app/models/user.model';
import { CreateReservationFromTableModalComponent } from 'src/app/modules/admin/modals/create-reservation-from-table-modal/create-reservation-from-table-modal.component';
import { GroupReservationInfoModalComponent } from 'src/app/modules/admin/modals/group-reservation-info-modal/group-reservation-info-modal.component';
import { ReservationInfoModalComponent } from 'src/app/modules/admin/modals/reservation-info-modal/reservation-info-modal.component';
import {
  selectedClubDate,
  updateReservationAdmin,
} from 'src/app/state/actions/club.actions';
import { loadCourts } from 'src/app/state/actions/clubConfiguration.actions';
import {
  loadCancelReservationCauses,
  loadReservationsAdmin,
} from 'src/app/state/actions/reservations.actions';
import {
  selectUpdateReservationFailure,
  selectUpdateReservationLoader,
  selectUpdateReservationSuccess,
} from 'src/app/state/selectors/club.selectors';
import { selectCourts } from 'src/app/state/selectors/clubConfiguration.selectors';
import {
  selectClubReservations,
  selectClubReservationsLoading,
} from 'src/app/state/selectors/reservetions.selectors';
import { selectUser } from 'src/app/state/selectors/users.selectors';
import Swal from 'sweetalert2';
import { parse, isBefore, isAfter } from 'date-fns';

@Component({
  selector: 'app-reservation-calendar',
  templateUrl: './reservation-calendar.component.html',
  styleUrls: ['./reservation-calendar.component.css'],
})
export class ReservationCalendarComponent {
  selectedDate: string = this.initializeSelectedDate();

  courts$: Observable<any[]> = this.store.select(selectCourts);
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

  private availableColors: string[] = ['bg-yellow-100 text-black'];

  private nameColorMap: { [key: string]: string } = {};

  draggedReservation: { reservation: Reservation; hour: string } | null = null;

  getCourtByName(name: string, courts: CourtDetail[]): CourtDetail | null {
    return courts.find((court) => court.name === name) || null;
  }

  onDragStart(event: DragEvent, reservation: Reservation, hour: string) {
    event.dataTransfer?.setData('text/plain', JSON.stringify(reservation));
    this.draggedReservation = { reservation, hour };
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(
    event: DragEvent,
    targetHourDescription: string,
    targetCourtName: string
  ) {
    event.preventDefault();
    if (!this.draggedReservation) return;

    const { reservation, hour } = this.draggedReservation;

    if (!reservation.id || !reservation.id.startsWith('I')) {
      Swal.fire({
        title: 'No se pudo realizar la operación',
        text: 'Solo puedes modificar reservas de una hora',
        icon: 'error',
      });
      this.draggedReservation = null;
      return;
    }

    this.courts$.pipe(take(1)).subscribe((courts: CourtDetail[]) => {
      const targetCourt = this.getCourtByName(targetCourtName, courts);

      if (!targetCourt) {
        console.error(
          `No se encontró una cancha con el nombre: ${targetCourtName}`
        );
        this.draggedReservation = null;
        return;
      }

      if (
        hour !== targetHourDescription ||
        reservation.courtId !== targetCourt.id
      ) {
        // Lógica para mover la reserva
        this.moveReservation(
          reservation,
          targetHourDescription,
          targetCourt.id.toString()
        );
      }
    });

    this.draggedReservation = null;
  }

  moveReservation(reservation: any, targetHour: string, targetCourt: string) {
    const formattedHour = targetHour.length < 5 ? `0${targetHour}` : targetHour;
    const combinedDateTime = `${this.selectedDate}T${formattedHour}:00`;

    const createReservationAdminDto: UpdateReservationDto = {
      reservationIdToUpdate: reservation.id,
      appointmentTime: [combinedDateTime],
      courtsId: [targetCourt],
    };

    // Despachar acción para mover la reserva
    this.store.dispatch(
      updateReservationAdmin({
        updateReservationAdminDto: createReservationAdminDto,
        selectedDate: this.selectedDate,
      })
    );

    this.store.select(selectUpdateReservationLoader).subscribe({
      next: (loading) => {
        if (loading) {
          Swal.fire({
            title: 'Modificando la reserva...',
            text: 'Por favor, espera mientras procesamos tu solicitud.',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });
        }
      },
    });

    this.store
      .select(selectUpdateReservationSuccess)
      .pipe(
        filter((success) => success),
        take(1)
      )
      .subscribe({
        next: () => {
          Swal.close();
          Swal.fire({
            title: 'Reserva actualizada',
            text: 'La reserva fue actualizada exitosamente.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
          });
        },
      });

    this.store
      .select(selectUpdateReservationFailure)
      .pipe(
        filter((failure) => failure),
        take(1)
      )
      .subscribe({
        next: () => {
          Swal.close();
          Swal.fire({
            title: 'No se pudo realizar la operación',
            text: 'Ocurrió un error al actualizar la reserva.',
            icon: 'error',
          });
          console.error('Error moviendo la reserva:');
        },
      });
  }

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
      hour: reservation.id === '-1' ? [combinedDateTime] : combinedDateTime,
      courtId: reservation.courtId,
    };

    if (reservation.id === '-1') {
      this.dialog.open(CreateReservationFromTableModalComponent, {
        maxWidth: '70vw',
        maxHeight: '70vh',
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
        maxWidth: '70vw',
        maxHeight: '70vh',
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

  getColorForName(name: string): string {
    if (!this.nameColorMap[name]) {
      this.nameColorMap[name] =
        this.availableColors[
          Object.keys(this.nameColorMap).length % this.availableColors.length
        ];
    }
    return this.nameColorMap[name];
  }

  getReservationClass(
    reservation: Reservation,
    index: number,
    rowDescription: string
  ): { [key: string]: boolean } {
    // Definir las clases predeterminadas (más prioritarias)
    const classes: { [key: string]: boolean } = {
      'bg-red-100': this.isCurrentTimeSlots[index],
      'bg-green-300': this.isSlotSelected(reservation, rowDescription),
      'cursor-not-allowed':
        (this.isPastTimes[index] && !this.isCurrentTimeSlots[index]) ||
        reservation.description === 'No disponible',
      'cursor-pointer': !(
        (this.isPastTimes[index] && !this.isCurrentTimeSlots[index]) ||
        reservation.description === 'No disponible'
      ),
      'text-green-700 bg-green-100':
        reservation.description === 'Disponible' &&
        !this.isCurrentTimeSlots[index] &&
        !this.isPastTimes[index],
      'text-red-600 ':
        reservation.description === 'No disponible' &&
        !this.isCurrentTimeSlots[index],
      'bg-gray-100': this.isPastTimes[index] && !this.isCurrentTimeSlots[index],
      'hover:bg-none':
        this.isPastTimes[index] || this.isCurrentTimeSlots[index],
    };

    // Comprobar si ya hay un fondo gris o rojo
    const hasGrayOrRedBackground =
      classes['bg-gray-100'] || classes['bg-red-100'];

    // Agregar la clase dinámica solo si no hay fondo gris o rojo
    if (
      !hasGrayOrRedBackground &&
      reservation.description !== 'Disponible' &&
      reservation.description !== 'No disponible'
    ) {
      const dynamicColorClass = this.getColorForName(reservation.description);
      classes[dynamicColorClass] = true;
    }

    return classes;
  }
}
