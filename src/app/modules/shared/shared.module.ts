import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonComponent } from './button/button.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { InputComponent } from './components/input/input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectComponent } from './components/select/select.component';
import { ErrorMessageComponent } from './components/error-message/error-message.component';
import { CheckboxComponent } from './components/chechbox/chechbox.component';
import { TimeFormatPipe } from './pipes/time-format.pipe';
import { LoaderComponent } from './components/loader/loader.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    ButtonComponent,
    InputComponent,
    SelectComponent,
    ErrorMessageComponent,
    CheckboxComponent,
    TimeFormatPipe,
    LoaderComponent,
  ],

  imports: [
    CommonModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
  ],
  exports: [
    ButtonComponent,
    InputComponent,
    SelectComponent,
    CheckboxComponent,
    TimeFormatPipe,
    LoaderComponent,
  ],
})
export class SharedModule {}
