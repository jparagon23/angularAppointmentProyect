import { ModalService } from './../../../../services/modal.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { toZonedTime, format } from 'date-fns-tz';
import { CLUB_ADMIN_ROLE } from 'src/app/modules/shared/constants/Constants.constants';
import {
  distinctUntilChanged,
  filter,
  map,
  Observable,
  Subscription,
  take,
  tap,
} from 'rxjs';
import {
  createReservation,
  loadAvailableSlots,
  loadReservations,
  resetCreateReservation,
} from 'src/app/state/actions/reservations.actions';
import { AppState } from 'src/app/state/app.state';
import {
  selectAvailableSlots,
  selectCreateReservationFailure,
  selectCreateReservationLoading,
  selectCreateReservationSuccess,
  selectGetAvailableSlotsFailure,
  selectLoadingAvailableSlots,
  selectReservationConfiguration,
} from 'src/app/state/selectors/reservetions.selectors';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import Swal from 'sweetalert2';
import { ClubAvailability } from 'src/app/models/ClubAvalability.model';
import {
  AvailableSlot,
  AvailableSlotsResponse,
} from 'src/app/models/AvailableSlotInfo.model';
import { User } from 'src/app/models/user.model';
import { selectUser } from 'src/app/state/selectors/users.selectors';
import { UserNameMakeReservationModalComponent } from 'src/app/modules/admin/modals/user-name-make-reservation-modal/user-name-make-reservation-modal.component';
import {
  createReservationAdmin,
  resetReservationCreated,
} from 'src/app/state/actions/club.actions';
import {
  loadingCreateReservation,
  reservationCreatedFailure,
  selectCreateReservationAdminSuccess,
  selectSelectedClubDate,
} from 'src/app/state/selectors/club.selectors';
import { selectCourts } from 'src/app/state/selectors/clubConfiguration.selectors';
import { CourtDetail } from 'src/app/models/CourtDetail.model';

@Component({
  selector: 'app-make-reservation-modal',
  templateUrl: './make-reservation-modal.component.html',
})
export class MakeReservationModalComponent implements OnInit, OnDestroy {
  selectedDate: string = '';
  selectedDateLoaded: boolean = false;
  rangeDateLoaded: boolean = false;
  availableTimeSlots$: Observable<AvailableSlotsResponse | null> =
    this.store.select(selectAvailableSlots);

  selectedSlots: string[] = [];
  selectedCourt: string = '';
  posibleCourts: string[][] = [];
  minDate: string = '';
  maxDate: string = '';
  noAvailability: boolean = false;
  public ADMIN_ROLE = CLUB_ADMIN_ROLE;

  // Loading and state observables

  createReservationLoader$: Observable<boolean> = this.store.select(
    selectCreateReservationLoading
  );

  createReservationAdminLoader$: Observable<boolean> = this.store.select(
    loadingCreateReservation
  );

  loadingAvailableSlots$: Observable<boolean> = this.store.select(
    selectLoadingAvailableSlots
  );
  loadingAvailableSlotsFailure$: Observable<boolean> = this.store.select(
    selectGetAvailableSlotsFailure
  );

  // Success and failure observables

  selectedClubDate$: Observable<string> = this.store.select(
    selectSelectedClubDate
  );

  createReservationSuccess$: Observable<boolean> = this.store.select(
    selectCreateReservationSuccess
  );
  createReservationFailure$: Observable<boolean> = this.store.select(
    selectCreateReservationFailure
  );

  createReservationAdminSuccess$: Observable<boolean> = this.store.select(
    selectCreateReservationAdminSuccess
  );
  createReservationAdminFailure$: Observable<boolean> = this.store.select(
    reservationCreatedFailure
  );

  user$: Observable<User> = new Observable<User>();

  user: User | null = null;

  private readonly subscriptions = new Subscription();

  courts$: Observable<CourtDetail[]> = this.store.select(selectCourts);

  constructor(
    public dialogRef: MatDialogRef<MakeReservationModalComponent>,
    private readonly store: Store<AppState>,
    private readonly dialog: MatDialog,
    private readonly modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.modalService.add(this.dialogRef);

    this.user$ = this.store.select(selectUser).pipe(
      filter((user): user is User => user !== null),
      distinctUntilChanged(),
      tap((user) => (this.user = user)), // Set this.user once the user is available
      take(1) // Complete after the first emission
    );

    this.user$.subscribe(() => {
      this.initializeSubscriptions(); // Call only after this.user is set
    });
  }

  ngOnDestroy(): void {
    this.modalService.remove(this.dialogRef);
    this.subscriptions.unsubscribe();
    this.store.dispatch(resetCreateReservation());
    this.store.dispatch(resetReservationCreated());
  }

  private initializeSubscriptions(): void {
    if (this.user?.role === 1) {
      this.subscriptions.add(
        this.store
          .select(selectReservationConfiguration)
          .subscribe((config) => {
            if (config) {
              this.handleReservationConfiguration(config);
              this.selectedDate = this.initializeSelectedDate();
              this.fetchAvailableSlots(this.selectedDate);
            }
          })
      );
    } else if (this.user?.role === 2) {
      this.handleReservationConfiguration({
        alwaysAvailable: true,
        byRange: false,
        initialDate: '',
        endDate: '',
        noAvailability: false,
      });
      this.selectedDate = this.initializeSelectedDate();
      this.fetchAvailableSlots(this.selectedDate);
    }

    this.subscriptions.add(
      this.createReservationSuccess$.subscribe((success) => {
        if (success) {
          this.handleReservationSuccess();
        }
      })
    );

    this.subscriptions.add(
      this.createReservationFailure$.subscribe((failure) => {
        if (failure) {
          this.handleReservationFailure();
        }
      })
    );

    this.subscriptions.add(
      this.loadingAvailableSlotsFailure$.subscribe((failure) => {
        if (failure) {
          this.handleLoadingSlotsFailure();
        }
      })
    );

    this.subscriptions.add(
      this.createReservationAdminSuccess$.subscribe((success) => {
        if (success) {
          this.handleReservationSuccess();
        }
      })
    );

    this.subscriptions.add(
      this.createReservationAdminFailure$.subscribe((failure) => {
        if (failure) {
          this.handleReservationFailure();
        }
      })
    );
  }

  getCourtNameById(id: number): Observable<string> {
    return this.courts$.pipe(
      map((courts) => {
        const court = courts.find((c) => c.id === id); // Busca la cancha por su ID
        return court ? court.name : `Cancha con ID ${id} no encontrada`;
      })
    );
  }

  private initializeSelectedDate(): string {
    const today = new Date();
    const bogotaTimeZone = 'America/Bogota';
    const zonedDate = toZonedTime(today, bogotaTimeZone);
    const formattedToday = format(zonedDate, 'yyyy-MM-dd', {
      timeZone: bogotaTimeZone,
    });

    // Para usuarios con role === 1
    if (this.user?.role === 1) {
      this.selectedDateLoaded = true;

      // Convertimos fechas a Date para realizar comparaciones
      const todayDate = new Date(formattedToday);
      const minDate = new Date(this.minDate);
      const maxDate = new Date(this.maxDate);

      // Validamos el rango
      if (todayDate < minDate || todayDate > maxDate) {
        return this.minDate; // Retorna la fecha mínima si está fuera del rango
      } else {
        return formattedToday; // Retorna la fecha de hoy si está dentro del rango
      }
    }

    // Para otros usuarios, manejamos la lógica con observables
    let selectedDate = formattedToday; // Por defecto, usamos la fecha de hoy
    this.selectedClubDate$.subscribe((date) => {
      if (date) {
        selectedDate = date;
      }
      this.selectedDateLoaded = true; // Marcamos como cargada una vez que el observable emite
    });

    return selectedDate;
  }

  private handleReservationConfiguration(config: ClubAvailability): void {
    this.noAvailability = config.noAvailability || false;
    if (this.noAvailability) {
      this.minDate = '';
      this.maxDate = '';
      this.rangeDateLoaded = true;

      return;
    }

    const today = new Date();
    const bogotaTimeZone = 'America/Bogota';
    const zonedDate = toZonedTime(today, bogotaTimeZone);
    const formattedToday = format(zonedDate, 'yyyy-MM-dd', {
      timeZone: bogotaTimeZone,
    });

    if (config.alwaysAvailable) {
      this.minDate = formattedToday;
      this.maxDate = '2100-12-31';
      this.rangeDateLoaded = true;
    } else if (config.byRange && config.initialDate && config.endDate) {
      if (config.endDate > formattedToday) {
        this.minDate = config.initialDate;
        this.maxDate = config.endDate;
        this.rangeDateLoaded = true;
      } else {
        this.minDate = '';
        this.maxDate = '';
        this.noAvailability = true;
        this.rangeDateLoaded = true;
      }
    }
  }

  fetchAvailableSlots(date: string): void {
    if (!this.noAvailability) {
      this.store.dispatch(loadAvailableSlots({ date }));
    }
  }

  onDateChange(date: string): void {
    if (date >= this.minDate && date <= this.maxDate) {
      this.selectedDate = date;
      this.selectedSlots = [];
      this.selectedCourt = '';
      this.posibleCourts = [];
      this.fetchAvailableSlots(this.selectedDate);
    } else {
      this.selectedDate = ''; // Restablecer la fecha seleccionada si no está en el rango permitido
      Swal.fire({
        icon: 'warning',
        title: 'Fecha no válida',
        text: 'La fecha seleccionada no está dentro del rango permitido.',
        confirmButtonColor: '#f39c12',
        confirmButtonText: 'OK',
      });
    }
  }

  onSlotSelected(slot: AvailableSlot) {
    if (this.selectedSlots.includes(slot.date.initialDateTime)) {
      this.deselectSlot(slot.date.initialDateTime);
    } else {
      this.selectSlot(slot.date.initialDateTime);
    }

    console.log(slot.date.availableCourts);

    if (this.posibleCourts.includes(slot.date.availableCourts)) {
      this.deselectCourt(slot.date.availableCourts);
    } else {
      this.posibleCourt(slot.date.availableCourts);
    }

    console.log(this.posibleCourts);
  }

  private posibleCourt(slot: string[]) {
    this.posibleCourts = [...this.posibleCourts, slot];
    // this.store.dispatch(selectSlot({ slot }));
  }

  private selectSlot(slot: string) {
    this.selectedSlots = [...this.selectedSlots, slot];
    // this.store.dispatch(selectSlot({ slot }));
  }

  private deselectSlot(slot: string) {
    this.selectedSlots = this.selectedSlots.filter((s) => s !== slot);
    // this.store.dispatch(deselectSlot({ slot }));
  }

  private deselectCourt(slot: string[]) {
    this.posibleCourts = this.posibleCourts.filter((s) => s !== slot);
  }
  onClickContinue(): void {
    if (this.selectedSlots.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No hay horas seleccionados',
        text: 'Debes seleccionar al menos un horario para la reserva.',
        confirmButtonColor: '#f39c12',
        confirmButtonText: 'OK',
      });
      return;
    }

    if (this.user?.role === 1) {
      const dialogRef = this.dialog.open(ConfirmationModalComponent, {
        maxWidth: '50vw',
        maxHeight: '50vh',
        data: { text: '¿Estas seguro que quieres realizar esta reserva?' },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result === true) {
          this.store.dispatch(
            createReservation({ selectedSlots: this.selectedSlots })
          );
        }
      });
    } else if (this.user?.role === 2) {
      const dialogRef = this.dialog.open(
        UserNameMakeReservationModalComponent,
        {
          maxWidth: '50vw',
          maxHeight: '50vh',
        }
      );

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.store.dispatch(
            createReservationAdmin({
              selecteDates: this.selectedSlots,
              userId: result.userId,
              lightUser: result.lightUser,
              court: this.selectedCourt,
            })
          );
        }
      });
    }
  }

  getCommonCourts(): string[] {
    if (this.posibleCourts.length === 0) return [];

    // Calcula la intersección de todas las listas
    return this.posibleCourts.reduce((common, current) =>
      common.filter((value) => current.includes(value))
    );
  }

  onCourtSelected(court: string) {
    this.selectedCourt = court;
  }

  private handleReservationSuccess(): void {
    this.dialogRef.close();

    Swal.fire({
      icon: 'success',
      title: 'Reserva creada',
      text: 'Tu reserva ha sido creada exitosamente.',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
    }).then(() => {
      this.store.dispatch(loadReservations());
    });
  }

  private handleReservationFailure(): void {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo crear la reserva. Inténtalo de nuevo.',
      confirmButtonColor: '#d33',
      confirmButtonText: 'OK',
    }).then(() => {
      this.selectedSlots = [];
      this.fetchAvailableSlots(this.selectedDate);
    });
  }

  private handleLoadingSlotsFailure(): void {
    Swal.fire({
      icon: 'error',
      title: 'Error al cargar espacios disponibles',
      text: 'Ocurrió un problema al cargar los espacios disponibles. Intenta de nuevo.',
      confirmButtonColor: '#d33',
      confirmButtonText: 'OK',
    });
  }
}
