// input.component.ts
import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { errorMessages } from '../../constants/Constants.constants';
import { Functions } from 'src/app/utils/funcitons';

import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

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
  @Input() displayLabel: boolean = true;
  @Input() displayErrorMessage: boolean = true;

  blurred: boolean = false;
  functions = Functions;

  isPasswordVisible: boolean = false;

  faEye = faEye;
  faEyeSlash = faEyeSlash;

  shouldApplyRedBorder(): boolean {
    return (
      !!this.control &&
      this.control.invalid &&
      (this.control.dirty || this.control.touched)
    );
  }

  shouldDisplayError(): boolean {
    return !!(this.control?.touched && this.control?.invalid);
  }

  capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  markAsBlurred() {
    this.blurred = true;
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  get inputType(): string {
    if (this.type !== 'password' && this.type !== 'text') {
      return this.type;
    }

    return this.type === 'password' && !this.isPasswordVisible
      ? 'password'
      : 'text';
  }
}
