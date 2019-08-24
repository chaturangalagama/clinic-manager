import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FollowUpsComponent } from './follow-ups/follow-ups.component';
import { CommunicationsMainComponent } from './communications-main/communications-main.component';
const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Communications'
    },

    children: [
      { path: '', pathMatch: 'full', redirectTo: 'main/follow-ups' },
      {
        path: 'main',
        component: CommunicationsMainComponent,
        data: {
          requiresLogin: true
        },
        children: [
          {
            path: 'follow-ups',
            component: FollowUpsComponent,
            data: {
              requiresLogin: true
            }
          }
        ]
      }
      // {
      //   path: 'follow-ups',
      //   component: FollowUpsComponent,
      //   data: {
      //     requiresLogin: true
      //   }
      // }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommunicationsRoutingModule {}
