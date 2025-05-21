import { Component, Input } from '@angular/core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
})
export class ButtonComponent {
  @Input() disabled = false;
  @Input() typeBtn: 'reset' | 'submit' | 'button' = 'button';
  @Input() loading = false;
  @Input() color:
    | 'success'
    | 'primary'
    | 'danger'
    | 'light'
    | 'sky'
    | 'continue'
    | 'navbar' = 'primary';
  faSpinner = faSpinner;

  // Mapa de colores actualizado con bg-[#418622] para success
  mapColors = {
    success: {
      'bg-[#418622]': true, // Color específico para success
      'hover:bg-[#35691a]': true, // Hover más oscuro
      'focus:ring-green-300': true,
      'text-white': true,
    },
    primary: {
      'bg-blue-700': true,
      'hover:bg-blue-800': true,
      'focus:ring-blue-300': true,
      'text-white': true,
    },
    danger: {
      'bg-red-700': true,
      'hover:bg-red-800': true,
      'focus:ring-red-300': true,
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
      'hover:bg-green-900': true,
      'focus:ring-primary-300': true,
      'text-white': true,
    },
    continue: {
      'bg-[#418622]': true, // Color específico para continue
      'hover:bg-[#35691a]': true, // Hover más oscuro
      'focus:ring-primary-300': true,
      'text-white': true,
    },
  };

  // Método para determinar las clases dinámicas
  get colors() {
    if (this.disabled) {
      return {
        'bg-gray-400': true,
        'cursor-not-allowed': true,
        'text-white': true,
      };
    }

    return this.mapColors[this.color] || {};
  }
}
