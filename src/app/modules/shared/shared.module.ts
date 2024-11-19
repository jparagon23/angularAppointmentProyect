import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonComponent } from './button/button.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { InputComponent } from './components/input/input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectComponent } from './components/select/select.component';
import { ErrorMessageComponent } from './components/error-message/error-message.component';
import { CheckboxComponent } from './components/chechbox/chechbox.component';
import { TimeFormatPipe } from './pipes/time-format.pipe';
import { LoaderComponent } from './components/loader/loader.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { UserInformationPageComponent } from './pages/user-information-page/user-information-page.component';
import { DateSelectorComponent } from './components/date-selector/date-selector.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TimePipe } from './pipes/time.pipe';
import { CapitalizeFirstWordPipe } from './pipes/capitalize-first-word.pipe';

@NgModule({
  declarations: [
    ButtonComponent,
    InputComponent,
    SelectComponent,
    ErrorMessageComponent,
    CheckboxComponent,
    TimeFormatPipe,
    TimePipe,
    LoaderComponent,
    UserInformationPageComponent,
    DateSelectorComponent,
    TimePipe,
    CapitalizeFirstWordPipe,
  ],

  imports: [
    CommonModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    FormsModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  exports: [
    ButtonComponent,
    InputComponent,
    SelectComponent,
    CheckboxComponent,
    TimeFormatPipe,
    TimePipe,
    LoaderComponent,
    DateSelectorComponent,
    CapitalizeFirstWordPipe,
  ],
})
export class SharedModule {}
