import { NgxPermissionsGuard } from 'ngx-permissions';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClaimListComponent } from './claim-list/claim-list.component';

export const routes: Routes = [
  {
    path: '',
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Claim'
    },
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'chas' },
      {
        path: 'chas',
        component: ClaimListComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          requiresLogin: true,
          permissions: {
            only: ['ROLE_MHCP_LIST', 'ROLE_MHCP_LIST_HQ']
            // redirectTo: () => {
            //   alert('Please check you have corresponding permission or not.');
            //   return 'pages/patient/list';
            // }
          }
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClaimRoutingModule {}
