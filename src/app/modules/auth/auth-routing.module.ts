import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { RegisterComponent } from './pages/register/register.component';
import { RecoveryComponent } from './pages/recovery/recovery.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { AccountAuthenticationComponent } from './pages/account-authentication/account-authentication.component';

const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        component: LoginComponent,
        title: 'Login',
      },
      {
        path: 'forgot-password',

        component: ForgotPasswordComponent,
        title: 'Forgot Password',
      },

      {
        path: 'register',
        component: RegisterComponent,
        title: 'Register',
      },
      {
        path: 'register/authAccount',
        component: AccountAuthenticationComponent,
        title: 'Account Authentication',
      },
      {
        path: 'recovery',
        component: RecoveryComponent,
        title: 'Recovery',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
