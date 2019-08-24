import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClinicSelectComponent } from './clinic-select/clinic-select.component';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Clinic'
    },

    children: [
      { path: '', pathMatch: 'full', redirectTo: 'select' },
      {
        path: 'select',
        component: ClinicSelectComponent,
        data: {
          requiresLogin: true
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClinicRoutingModule {}
