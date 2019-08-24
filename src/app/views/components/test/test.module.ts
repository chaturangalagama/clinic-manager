import { SharedModule } from './../../../shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestRoutingModule } from './test-routing.module';
import { TestPageComponent } from './test-page/test-page.component';

@NgModule({
  imports: [CommonModule, TestRoutingModule, SharedModule],
  declarations: [TestPageComponent]
})
export class TestModule {}
