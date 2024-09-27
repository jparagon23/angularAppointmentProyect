import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CommonType } from 'src/app/models/InitialSignUpData.interface';
import { Functions } from 'src/app/utils/funcitons';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
})
export class SelectComponent {
  @Input() control!: FormControl;
  @Input() name!: string;
  @Input() description!: string;
  @Input() options!: CommonType[];
  blurred: boolean = false;
  functions = Functions;

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
}
