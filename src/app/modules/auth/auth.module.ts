import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BackgroundComponent } from './components/background/background.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { LoginComponent } from './pages/login/login.component';
import { RecoveryComponent } from './pages/recovery/recovery.component';
import { RegisterComponent } from './pages/register/register.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    BackgroundComponent,
    FooterComponent,
    LoginFormComponent,
    ForgotPasswordComponent,
    LoginComponent,
    RecoveryComponent,
    RegisterComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    FontAwesomeModule,
  ],
})
export class AuthModule {}
