import { RouterModule, Routes } from '@angular/router';
import { ClubsPagesComponent } from './pages/clubs-pages/clubs-pages.component';
import { NgModule } from '@angular/core';
import { ClubPageComponent } from './pages/club-page/club-page.component';

const routes: Routes = [
  {
    path: '',
    component: ClubsPagesComponent,
  },
  {
    path: ':id',
    component: ClubPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClubsRoutingModule {}
