import { NgModule } from '@angular/core';

import { SharedModule } from '../../../shared.module';
import { ConsultationComponentsModule } from './../../../components/consultation/consultation-components.module';
import { ConsultationAddComponent } from './consultation-add/consultation-add.component';
import { ConsultationRoutingModule } from './consultation-routing.module';

@NgModule({
  imports: [ConsultationRoutingModule, SharedModule, ConsultationComponentsModule],
  declarations: [ConsultationAddComponent]
})
export class ConsultationModule {}
