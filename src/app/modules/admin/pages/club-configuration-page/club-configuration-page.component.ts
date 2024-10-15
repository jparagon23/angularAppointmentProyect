import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ClubAvailability } from 'src/app/models/ClubAvalability.model';
import {
  loadAvailability,
  saveAvailability,
} from 'src/app/state/actions/clubConfiguration.actions';
import { AppState } from 'src/app/state/app.state';
import { selectClubAvailability } from 'src/app/state/selectors/clubConfiguration.selectors';

@Component({
  selector: 'app-club-configuration-page',
  templateUrl: './club-configuration-page.component.html',
})
export class ClubConfigurationPageComponent implements OnInit {
  availabilityForm!: FormGroup;
  availability$!: Observable<ClubAvailability>;
  isSaveButtonDisabled = true;

  constructor(private readonly store: Store<AppState>) {}

  ngOnInit() {
    this.initializeForm();
    this.loadClubAvailability();
    this.subscribeToAvailabilityChanges();
    this.handleCheckboxExclusion();
    this.subscribeToByRangeChanges();
    this.subscribeToFormChanges();
  }

  private initializeForm() {
    this.availabilityForm = new FormGroup({
      alwaysAvailable: new FormControl(false),
      noAvailability: new FormControl(false),
      byRange: new FormControl(false), // Nuevo checkbox
      initialDate: new FormControl({ value: '', disabled: true }),
      endDate: new FormControl({ value: '', disabled: true }),
    });
  }

  private loadClubAvailability() {
    this.store.dispatch(loadAvailability({ clubId: 1 }));
  }

  private subscribeToAvailabilityChanges() {
    this.availability$ = this.store.select(selectClubAvailability);
    this.availability$.subscribe((availability) => {
      if (availability) {
        this.updateFormValues(availability);
        this.toggleDateFields();
      }
    });
  }

  private updateFormValues(availability: ClubAvailability) {
    this.availabilityForm.patchValue({
      alwaysAvailable: availability.alwaysAvailable ?? false,
      noAvailability: availability.noAvailability ?? false,
      byRange: !availability.alwaysAvailable && !availability.noAvailability,
      initialDate: availability.initialDate ?? '',
      endDate: availability.endDate ?? '',
    });
    this.availabilityForm.markAsPristine(); // Marcar el formulario como no modificado
  }

  private handleCheckboxExclusion() {
    const checkboxes = ['alwaysAvailable', 'noAvailability', 'byRange'];
    checkboxes.forEach((checkbox) => {
      this.availabilityForm.get(checkbox)!.valueChanges.subscribe((value) => {
        if (value) {
          this.uncheckOtherCheckboxes(checkboxes, checkbox);
          this.toggleDateFields();
        }
      });
    });
  }

  private uncheckOtherCheckboxes(
    checkboxes: string[],
    selectedCheckbox: string
  ) {
    checkboxes
      .filter((cb) => cb !== selectedCheckbox)
      .forEach((cb) => this.availabilityForm.get(cb)!.setValue(false));
  }

  private subscribeToByRangeChanges() {
    this.availabilityForm.get('byRange')!.valueChanges.subscribe(() => {
      this.toggleDateFields();
    });
  }

  private toggleDateFields() {
    const { alwaysAvailable, noAvailability, byRange } =
      this.availabilityForm.value;
    const shouldEnableDates = byRange && !alwaysAvailable && !noAvailability;

    if (shouldEnableDates) {
      this.availabilityForm.get('initialDate')!.enable();
      this.availabilityForm.get('endDate')!.enable();
    } else {
      this.availabilityForm.get('initialDate')!.disable();
      this.availabilityForm.get('endDate')!.disable();
    }
  }

  private subscribeToFormChanges() {
    this.availabilityForm.valueChanges.subscribe(() => {
      this.isSaveButtonDisabled = !this.availabilityForm.dirty;
    });
  }

  submitAvailability() {
    const availabilityData = this.availabilityForm.value;
    console.log(availabilityData);

    // Dispatch para guardar la disponibilidad
    this.store.dispatch(saveAvailability({ availability: availabilityData }));
  }
}
