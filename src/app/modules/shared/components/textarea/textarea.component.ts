import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Functions } from 'src/app/utils/funcitons';

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.css']
})
export class TextareaComponent {
  @Input() control!: FormControl;
  @Input() name!: string;
  @Input() description!: string;
  @Input() placeholder: string = '';
  @Input() rows: number = 4;
  @Input() displayLabel: boolean = true;
  @Input() displayErrorMessage: boolean = true;

  @Output() valueChange = new EventEmitter<string>();

  blurred: boolean = false;
  functions = Functions;

  markAsBlurred() {
    this.blurred = true;
  }

  shouldApplyRedBorder(): boolean {
    return (
      !!this.control &&
      this.control.invalid &&
      (this.control.dirty || this.control.touched)
    );
  }

  onValueChange(event: Event): void {
    const inputValue = (event.target as HTMLTextAreaElement).value;
    this.valueChange.emit(inputValue);
  }
}
