import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../../shared.module';
import { PaymentComponentsModule } from '../../../components/payment/payment-components.module';
import { ConsultationComponentsModule } from '../../../components/consultation/consultation-components.module';

import { PaymentRoutingModule } from './payment-routing.module';

@NgModule({
  imports: [
    CommonModule,
    PaymentRoutingModule,
    SharedModule,
    PaymentComponentsModule,
    ConsultationComponentsModule
  ],
  declarations: []
})
export class PaymentModule {}
