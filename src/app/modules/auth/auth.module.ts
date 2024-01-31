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
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { AccountAuthenticationComponent } from './pages/account-authentication/account-authentication.component';
import { AccountAuthFormComponent } from './components/account-auth-form/account-auth-form.component';
import { ForgotPasswordFormComponent } from './components/forgot-password/forgot-password-form.component';
import { RecoveryFormComponent } from './components/recovery-form/recovery-form.component';

@NgModule({
  declarations: [
    BackgroundComponent,
    FooterComponent,
    LoginFormComponent,
    ForgotPasswordComponent,
    LoginComponent,
    RecoveryComponent,
    RegisterComponent,
    AuthLayoutComponent,
    RegisterFormComponent,
    AccountAuthenticationComponent,
    AccountAuthFormComponent,
    ForgotPasswordFormComponent,
    RecoveryFormComponent,
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
