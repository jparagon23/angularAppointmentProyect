import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CourtDetail } from 'src/app/models/CourtDetail.model';
import { CreateCourt } from 'src/app/models/CreateCourt.model';
import { HttpErrorResponse } from 'src/app/models/httpErrorResponse.model';
import {
  createCourt,
  loadCourts,
} from 'src/app/state/actions/clubConfiguration.actions';
import { AppState } from 'src/app/state/app.state';
import {
  selectCourtCreated,
  selectCourtCreationError,
  selectCourts,
  selectCreatingCourtLoading,
  selectLoadingCourts,
} from 'src/app/state/selectors/clubConfiguration.selectors';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-courts-page',
  templateUrl: './courts-page.component.html',
})
export class CourtsPageComponent implements OnInit, OnDestroy {
  courts$: Observable<CourtDetail[]> = this.store.select(selectCourts);
  loadingCourts$: Observable<boolean> = this.store.select(selectLoadingCourts);
  creatingCourtLoading$: Observable<boolean> = this.store.select(
    selectCreatingCourtLoading
  );
  courtCreated$: Observable<boolean> = this.store.select(selectCourtCreated);
  courtCreationError$: Observable<HttpErrorResponse> = this.store.select(
    selectCourtCreationError
  ); // Error observable

  // State for creating a new court
  isCreatingNewCourt = false;
  newCourt: CreateCourt = this.getInitialCourtState();

  private readonly unsubscribe$ = new Subject<void>();

  constructor(private readonly store: Store<AppState>) {}

  ngOnInit(): void {
    this.loadCourts();
    this.handleCourtCreation();
  }

  // Dispatch action to load courts
  private loadCourts(): void {
    this.store.dispatch(loadCourts());
  }

  // Handle court creation success and failure
  private handleCourtCreation(): void {
    this.courtCreated$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((created) => {
        if (created) {
          this.resetCreationForm();
        }
      });

    this.courtCreationError$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((error) => {
        if (error) {
          this.handleCreationError(error);
        }
      });
  }

  // Handle error when creating a court
  private handleCreationError(error: HttpErrorResponse): void {
    Swal.fire({
      icon: 'error',
      title: 'No se pudo crear la cancha',
      text: error.error.message.join(' '), // Asegúrate de que el texto sea una cadena
      confirmButtonColor: '#3085d6', // Cambia el color del botón
      confirmButtonText: 'OK', // Texto del botón
      customClass: {
        confirmButton: 'swal2-confirm', // Clase para el botón
      },
    });
  }

  // Start the process of creating a new court
  startCreatingCourt(): void {
    this.isCreatingNewCourt = true;
  }

  // Dispatch action to create a new court if the data is valid
  saveNewCourt(): void {
    if (this.isNewCourtValid()) {
      this.store.dispatch(createCourt({ court: this.newCourt }));
    }
  }

  // Validate the new court form
  private isNewCourtValid(): boolean {
    const { name, initialAvailableHour, lastAvailableHour } = this.newCourt;
    return (
      !!name.trim() &&
      !!initialAvailableHour.trim() &&
      !!lastAvailableHour.trim()
    );
  }

  // Reset the court creation form
  private resetCreationForm(): void {
    this.isCreatingNewCourt = false;
    this.newCourt = this.getInitialCourtState();
  }

  // Get the initial state for creating a new court
  private getInitialCourtState(): CreateCourt {
    return {
      name: '',
      initialAvailableHour: '',
      lastAvailableHour: '',
    };
  }

  // Cancel the creation process
  cancelNewCourt(): void {
    this.resetCreationForm();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
