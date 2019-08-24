import { ReportSearchResultComponent } from './report-search-result/report-search-result.component';
import { ReportSearchComponent } from './report-search/report-search.component';
import { CanDeactivateGuardService } from './../../../services/can-deactivate-guard.service';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportListComponent } from './report-list/report-list.component';

export const routes: Routes = [
  {
    path: '',
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Report'
    },
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'search' },
      {
        path: 'list',
        component: ReportListComponent,
        data: {
          requiresLogin: true
        }
      },
      {
        path: 'search',
        component: ReportSearchComponent,
        data: {
          requiresLogin: true
        }
      },
      {
        path: 'result',
        component: ReportSearchResultComponent,
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
export class ReportRoutingModule {}
