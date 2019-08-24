import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';

export const routes: Routes = [
  {
    path: '',
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Medical Coverage',
      permissions: {
        only: [
          "ROLE_MEDICAL_COVERAGE_MANAGEMENT",
        ],
      },
    },
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'search' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedicalCoverageRoutingModule { }
