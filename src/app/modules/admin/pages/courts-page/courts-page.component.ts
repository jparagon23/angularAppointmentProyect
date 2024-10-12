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
  );

  isCreatingNewCourt = false;
  newCourt: CreateCourt = this.getInitialCourtState();

  private readonly unsubscribe$ = new Subject<void>();

  constructor(private readonly store: Store<AppState>) {}

  ngOnInit(): void {
    this.loadCourts();
    this.handleCourtCreation();
  }

  private loadCourts(): void {
    this.store.dispatch(loadCourts());
  }

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

  private handleCreationError(error: HttpErrorResponse): void {
    const errorMessage = Array.isArray(error.error.message)
      ? error.error.message.join(' ')
      : 'An unexpected error occurred';

    Swal.fire({
      icon: 'error',
      title: 'No se pudo crear la cancha',
      text: errorMessage,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
      customClass: {
        confirmButton: 'swal2-confirm',
      },
    });
  }

  startCreatingCourt(): void {
    this.isCreatingNewCourt = true;
  }

  saveNewCourt(): void {
    if (this.isNewCourtValid()) {
      this.store.dispatch(createCourt({ court: this.newCourt }));
    }
  }

  private isNewCourtValid(): boolean {
    const { name, initialAvailableHour, lastAvailableHour } = this.newCourt;
    return (
      !!name.trim() &&
      !!initialAvailableHour.trim() &&
      !!lastAvailableHour.trim()
    );
  }

  private resetCreationForm(): void {
    this.isCreatingNewCourt = false;
    this.newCourt = this.getInitialCourtState();
  }

  private getInitialCourtState(): CreateCourt {
    return {
      name: '',
      initialAvailableHour: '',
      lastAvailableHour: '',
    };
  }

  cancelNewCourt(): void {
    this.resetCreationForm();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
