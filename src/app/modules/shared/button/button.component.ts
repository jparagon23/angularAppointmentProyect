import { Component, Input } from '@angular/core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
})
export class ButtonComponent {
  @Input() disabled = false;
  @Input() loading = false;
  @Input() typeBtn: 'reset' | 'submit' | 'button' = 'button';
  @Input() color:
    | 'success'
    | 'primary'
    | 'danger'
    | 'light'
    | 'sky'
    | 'continue'
    | 'navbar' = 'primary';
  faSpinner = faSpinner;

  mapColors = {
    success: {
      'bg-success-700': true,
      'hover:bg-success-800': true,
      'focus:ring-success-300': true,
      'text-white': true,
    },
    primary: {
      'bg-primary-700': true,
      'hover:bg-primary-800': true,
      'focus:ring-primary-300': true,
      'text-white': true,
    },
    danger: {
      'bg-danger-700': true,
      'hover:bg-danger-800': true,
      'focus:ring-danger-300': true,
      'text-white': true,
    },
    light: {
      'bg-gray-200': true,
      'hover:bg-gray-400': true,
      'focus:ring-gray-50': true,
      'text-gray-700': true,
    },
    sky: {
      'bg-sky-700': true,
      'hover:bg-sky-800': true,
      'focus:ring-sky-300': true,
      'text-white': true,
    },
    navbar: {
      'bg-green-700': true,
      'text-white': true,
      'hover:bg-green-900': true,
      'focus:ring-primary-300': true,
    },
    continue: {
      'bg-[#418622]': true,
      'hover:bg-[#35691a]': true,
      'focus:ring-primary-300': true,
      'text-white': true,
    },
  };

  constructor() {}

  get colors() {
    if (this.disabled) {
      return {
        'bg-gray-400': true, // or any other color for disabled state
        'cursor-not-allowed': true,
        'text-white': true,
      };
    }

    const selectedColors = this.mapColors[this.color];
    if (selectedColors) {
      return selectedColors;
    }
    return {};
  }
}
