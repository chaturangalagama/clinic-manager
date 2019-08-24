import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';

import { CanDeactivateGuardService } from './../../../services/can-deactivate-guard.service';
import { ConsultationAddComponent } from './consultation-add/consultation-add.component';

export const routes: Routes = [
  {
    path: '',
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Consultation',
      permissions: {
        only: [
          "ROLE_PATIENT_MANAGE_CONSULT",
        ],
      },
    },
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'add' },
      {
        path: 'add',
        component: ConsultationAddComponent,
        data: {
          requiresLogin: true
        },
        canDeactivate: [CanDeactivateGuardService]
      },
      {
        path: 'add/:refresh',
        component: ConsultationAddComponent,
        data: {
          requiresLogin: true
        },
        canDeactivate: [CanDeactivateGuardService]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultationRoutingModule { }
