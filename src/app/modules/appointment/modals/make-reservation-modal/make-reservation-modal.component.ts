import { ModalService } from './../../../../services/modal.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { toZonedTime, format } from 'date-fns-tz';
import {
  distinctUntilChanged,
  filter,
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
import { AvailableSlotsResponse } from 'src/app/models/AvailableSlotInfo.model';
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
} from 'src/app/state/selectors/club.selectors';

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
  minDate: string = '';
  maxDate: string = '';
  noAvailability: boolean = false;

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

  private initializeSelectedDate(): string {
    const today = new Date();
    const bogotaTimeZone = 'America/Bogota';
    const zonedDate = toZonedTime(today, bogotaTimeZone);
    const formattedToday = format(zonedDate, 'yyyy-MM-dd', {
      timeZone: bogotaTimeZone,
    });

    if (this.user?.role === 1) {
      // Verificar si la fecha actual está fuera del rango permitido
      if (formattedToday < this.minDate || formattedToday > this.maxDate) {
        this.selectedDateLoaded = true;

        return this.minDate; // Retornar cadena vacía si está fuera del rango
      } else {
        this.selectedDateLoaded = true;

        return formattedToday; // Si está dentro del rango, retornar la fecha de hoy
      }
    } else {
      this.selectedDateLoaded = true;

      return formattedToday;
    }
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

  onSlotSelected(slot: any) {
    if (this.selectedSlots.includes(slot)) {
      this.deselectSlot(slot);
    } else {
      this.selectSlot(slot);
    }
  }

  private selectSlot(slot: any) {
    this.selectedSlots = [...this.selectedSlots, slot];
    // this.store.dispatch(selectSlot({ slot }));
  }

  private deselectSlot(slot: any) {
    this.selectedSlots = this.selectedSlots.filter((s) => s !== slot);
    // this.store.dispatch(deselectSlot({ slot }));
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
            })
          );
        }
      });
    }
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
