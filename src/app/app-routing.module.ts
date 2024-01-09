import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './pages/noAuthPages/landing-page/landing-page.component';
import { NoPageFoundComponent } from './pages/noAuthPages/no-page-found/no-page-found.component';
import { LoginComponent } from './auth/login/login.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent, pathMatch: 'full' },
  { path: '**', component: NoPageFoundComponent },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
