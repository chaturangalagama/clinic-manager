import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileChangePasswordComponent } from './profile-change-password/profile-change-password.component';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Profile',
    },
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'change' },
      {
        path: 'change',
        component: ProfileChangePasswordComponent
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
