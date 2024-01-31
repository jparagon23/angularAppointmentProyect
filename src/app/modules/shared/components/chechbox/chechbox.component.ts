import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Functions } from 'src/app/utils/funcitons';

@Component({
  selector: 'app-checkbox',
  templateUrl: './chechbox.component.html',
})
export class CheckboxComponent {
  functions = Functions;
  @Input() control!: FormControl;
  @Input() name: string = '';

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
}
