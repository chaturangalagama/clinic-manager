import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from './../../../shared.module';
import { ClinicRoutingModule } from './clinic-routing.module';
import { ClinicSelectComponent } from './clinic-select/clinic-select.component';

@NgModule({
  imports: [CommonModule, ClinicRoutingModule, SharedModule],
  declarations: []
})
export class ClinicModule {}
