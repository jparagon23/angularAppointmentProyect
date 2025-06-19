import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { UserInformationPageComponent } from '../shared/pages/user-information-page/user-information-page.component';
import { MatchesPageComponent } from '../match/pages/matches-page/matches-page.component';
import { UserProfileComponent } from '../user/pages/user-profile/user-profile-page.component';
import { PostMatchComponent } from '../match/modals/post-match/post-match.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardPageComponent,
    pathMatch: 'full',
  },
  {
    path: 'user-information',
    component: UserInformationPageComponent,
  },
  {
    path: 'matches',
    component: MatchesPageComponent,
  },
  {
    path: 'profile/:id',
    component: UserProfileComponent,
  },
  {
    path: 'clubs',
    loadChildren: () =>
      import('../clubs/clubs.module').then((m) => m.ClubsModule),
  },
  {
    path: 'post-match',
    component: PostMatchComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppointmentRoutingModule {}
