import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaseChargeComponent } from './case-charge/case-charge.component';
import { CaseChargeItemComponent } from './case-charge/case-charge-item/case-charge-item.component';
import { SharedModule } from '../../shared.module';
import { ChargeItemTouchedObjectDirective } from '../../directives/touched/charge.item.touched.object.directive';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  declarations: [
    CaseChargeComponent,
    CaseChargeItemComponent,
    ChargeItemTouchedObjectDirective
  ],
  exports: [
    CaseChargeComponent
  ]
})
export class CaseManagerComponentsModule {}
