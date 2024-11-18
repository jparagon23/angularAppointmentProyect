import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of, Subject, takeUntil } from 'rxjs';
import { CancellationClubCauses } from 'src/app/models/CancellationClubCauses.model';
import {
  createCancelReservationCauses,
  deleteCancelReservationCauses,
  updateCancelReservationCauses,
} from 'src/app/state/actions/reservations.actions';
import { AppState } from 'src/app/state/app.state';
import {
  selectCancellationCauses,
  selectCreateCancelReservationSuccess,
  selectdeleteCancelReservationSuccess,
  selectupdateCancelReservationSuccess,
} from 'src/app/state/selectors/reservetions.selectors';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cancellation-causes-config',
  templateUrl: './cancellation-causes-config.component.html',
  styleUrls: ['./cancellation-causes-config.component.css'],
})
export class CancellationCausesConfigComponent implements OnInit {
  causes$: Observable<CancellationClubCauses[]> = this.store.select(
    selectCancellationCauses
  );

  private readonly destroy$ = new Subject<void>();

  constructor(private readonly store: Store<AppState>) {}

  loadingCauses$: Observable<boolean> = of(false);
  creatingCauseLoading$: Observable<boolean> = of(false);

  // Modal and form control
  showModal: boolean = false;
  isEditingCause: boolean = false;

  // Model for the current cause being created or edited
  currentCause: CancellationClubCauses = { id: 0, description: '', clubId: 1 };

  createCancelReservationCausesSuccess$ = this.store.select(
    selectCreateCancelReservationSuccess
  );

  updateCancelReservationSuccess$ = this.store.select(
    selectupdateCancelReservationSuccess
  );

  deleteCancelReservationSuccess$ = this.store.select(
    selectdeleteCancelReservationSuccess
  );

  ngOnInit(): void {
    this.createCancelReservationCausesSuccess$
      .pipe(takeUntil(this.destroy$))
      .subscribe((success) => {
        if (success) {
          this.closeLoaderModal();
          this.closeModal();
        }
      });

    this.updateCancelReservationSuccess$
      .pipe(takeUntil(this.destroy$))
      .subscribe((success) => {
        if (success) {
          this.closeLoaderModal();
        }
      });

    this.deleteCancelReservationSuccess$
      .pipe(takeUntil(this.destroy$))
      .subscribe((success) => {
        if (success) {
          this.closeLoaderModal();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  // Open modal to either create or edit a cause
  openModal(isEditMode: boolean, cause?: CancellationClubCauses) {
    this.showModal = true;
    this.isEditingCause = isEditMode;

    // Set current cause for editing, or reset it for creating
    this.currentCause =
      isEditMode && cause
        ? { ...cause }
        : { id: 0, description: '', clubId: 1 };
  }

  // Save new or updated cause
  saveCause() {
    if (!this.currentCause.description.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'La descripción no puede estar vacía',
      });
      return;
    }

    if (this.isEditingCause) {
      this.updateCause(this.currentCause);
    } else {
      this.createCause(this.currentCause);
    }
  }

  // Logic to update an existing cause
  updateCause(cause: CancellationClubCauses) {
    this.OpenLoaderModal();
    this.store.dispatch(
      updateCancelReservationCauses({
        causeId: cause.id.toString(),
        description: cause.description,
      })
    );
  }

  // Logic to create a new cause
  createCause(cause: CancellationClubCauses) {
    this.OpenLoaderModal();
    this.store.dispatch(
      createCancelReservationCauses({ description: cause.description })
    );
  }

  // Logic to delete a cause
  deleteCause(cause: CancellationClubCauses) {
    this.OpenLoaderModal();
    this.store.dispatch(deleteCancelReservationCauses({ causeId: cause.id }));
    // Add backend deletion logic here
  }

  // Close the modal and reset form fields
  closeModal() {
    this.showModal = false;
    this.isEditingCause = false;
    this.currentCause = { id: 0, description: '', clubId: 1 };
  }

  OpenLoaderModal() {
    Swal.fire({
      title: 'Procesando...',
      text: 'Por favor espera',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  }

  closeLoaderModal() {
    Swal.close();
    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: 'La operación se realizó correctamente',
    });
  }
}
