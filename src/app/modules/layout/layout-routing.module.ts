import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,

    children: [
      {
        path: 'user',
        title: 'Forehapp',
        loadChildren: () =>
          import('../appointment/appointment.module').then(
            (m) => m.AppointmentModule
          ),
      },
      {
        path: 'admin',
        title: 'Forehapp',
        loadChildren: () =>
          import('../admin/admin.module').then((m) => m.AdminModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
