import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../../shared.module';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileChangePasswordComponent } from './profile-change-password/profile-change-password.component';

@NgModule({
  imports: [CommonModule, SharedModule, ProfileRoutingModule],
  declarations: [ProfileChangePasswordComponent],
})
export class ProfileModule { }
