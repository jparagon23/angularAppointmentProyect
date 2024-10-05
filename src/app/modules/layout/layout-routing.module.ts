import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,

    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('../appointment/appointment.module').then(
            (m) => m.AppointmentModule
          ),
      },
      {
        path: 'admin/dashboard',
        loadChildren: () =>
          import('../admin/admin.module').then((m) => m.AdminModule),
      },
      // {
      //   path: 'boards',
      //   loadChildren: () =>
      //     import('../boards/boards.module').then((m) => m.BoardsModule),
      // },
      // {
      //   path: 'profile',
      //   loadChildren: () =>
      //     import('../profile/profile.module').then((m) => m.ProfileModule),
      // },
      // {
      //   path: 'users',
      //   loadChildren: () =>
      //     import('../users/users.module').then((m) => m.UsersModule),
      // },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
