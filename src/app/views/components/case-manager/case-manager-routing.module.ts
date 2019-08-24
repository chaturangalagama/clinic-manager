import { NgxPermissionsGuard } from 'ngx-permissions';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CaseManagerListComponent } from './case-manager-list/case-manager-list.component';
import { CaseDetailsComponent } from './case-manager-details/case-details.component';

export const routes: Routes = [
  {
    path: '',
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Case Manager'
    },
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'search' },
      {
        path: 'list',
        component: CaseManagerListComponent,
        data: {
          requiresLogin: true
        }
      },
      {
        path: 'detail',
        component: CaseDetailsComponent,
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
export class CaseManagerRoutingModule {}
