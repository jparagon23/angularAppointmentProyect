import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonComponent } from './button/button.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { InputComponent } from './components/input/input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectComponent } from './components/select/select.component';
import { ErrorMessageComponent } from './components/error-message/error-message.component';

@NgModule({
  declarations: [
    ButtonComponent,
    InputComponent,
    SelectComponent,
    ErrorMessageComponent,
  ],
  imports: [CommonModule, FontAwesomeModule, ReactiveFormsModule],
  exports: [ButtonComponent, InputComponent, SelectComponent],
})
export class SharedModule {}
