import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MedicalCoverageRoutingModule } from './medical-coverage-routing.module';

import { SharedModule } from '../../../shared.module';

@NgModule({
  imports: [CommonModule, MedicalCoverageRoutingModule, SharedModule],
  declarations: []
})
export class MedicalCoverageModule { }
