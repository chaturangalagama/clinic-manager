import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from './../../../shared.module';
import { CommunicationsRoutingModule } from './communications-routing.module';
import { CommunicationsMainComponent } from './communications-main/communications-main.component';

@NgModule({
  imports: [CommonModule, CommunicationsRoutingModule, SharedModule],
  declarations: [CommunicationsMainComponent]
  // exports: [CommunicationsComponent]
})
export class CommunicationsModule {}
