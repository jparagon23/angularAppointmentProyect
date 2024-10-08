import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      // Ruta para usuarios no admin
      {
        path: 'dashboard',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('../appointment/appointment.module').then(
            (m) => m.AppointmentModule
          ),
      },
      // Ruta para usuarios admin
      {
        path: 'admin/dashboard',
        canActivate: [AuthGuard],
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
