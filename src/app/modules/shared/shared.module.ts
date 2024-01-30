import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonComponent } from './button/button.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { InputComponent } from './components/input/input.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ButtonComponent, InputComponent],
  imports: [CommonModule, FontAwesomeModule, ReactiveFormsModule],
  exports: [ButtonComponent, InputComponent],
})
export class SharedModule {}
