import { NgxPermissionsGuard } from 'ngx-permissions';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TestPageComponent } from './test-page/test-page.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Report'
    },
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'top' },

      {
        path: 'top',
        component: TestPageComponent,
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
export class TestRoutingModule {}
