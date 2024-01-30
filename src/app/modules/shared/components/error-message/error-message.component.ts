import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { errorMessages } from '../../constants/Constants.constants';

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
})
export class ErrorMessageComponent {
  @Input() control!: FormControl;
  private blurred: boolean = false;

  shouldShowError(): boolean {
    return (
      !!this.control &&
      this.control.invalid &&
      (this.control.dirty || this.control.touched)
    );
  }

  onBlur(): void {
    this.blurred = true;
  }

  getErrorMessage(): string {
    if (!this.control?.errors) {
      return '';
    }

    const errors = this.control.errors;

    for (const error of errorMessages) {
      if (errors[error.type]) {
        // Interpolate variables into the error message
        return error.description.replace(
          /\${(\w+)}/g,
          (_, variable) => errors[error.type][variable]
        );
      }
    }

    return 'Invalid value.';
  }
}
