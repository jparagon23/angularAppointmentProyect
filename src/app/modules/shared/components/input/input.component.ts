// input.component.ts
import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { errorMessages } from '../../constants/Constants.constants';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
})
export class InputComponent {
  @Input() control!: FormControl;
  @Input() name!: string;
  @Input() type!: string;
  @Input() label!: string;
  @Input() placeholder!: string;
  @Input() formControlName!: string;

  shouldApplyRedBorder(): boolean {
    console.log('!!this.control ' + !!this.control);
    console.log('invalid ' + !!this.control?.invalid);
    console.log('dirty ' + !!this.control?.dirty);
    console.log('Touched ' + !!this.control?.touched);

    return (
      !!this.control &&
      this.control.invalid &&
      (this.control.dirty || this.control.touched)
    );
  }

  shouldDisplayError(): boolean {
    console.log(
      'should display error ' +
        !!(this.control?.touched && this.control?.invalid)
    );

    return !!(this.control?.touched && this.control?.invalid);
  }

  shouldShowError(): boolean {
    console.log('shouldShowError called');
    console.log('Control:', this.control);
    return (
      !!this.control &&
      this.control.invalid &&
      (this.control.dirty || this.control.touched)
    );
  }

  getErrorMessage(): string {
    console.log('getErrorMessage called');
    console.log('Control:', this.control);
    if (!this.control?.errors) {
      return '';
    }

    const errors = this.control.errors;

    for (const error of errorMessages) {
      if (errors[error.type]) {
        return error.description;
      }
    }
    return 'Invalid value.';
  }
}
