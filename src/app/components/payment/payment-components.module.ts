import { PaymentMultiStepLayoutComponent } from './../../containers/payment-multi-step-layout/payment-multi-step-layout.component';
import { PaymentCollectComponent } from './../../views/components/payment/payment-collect/payment-collect.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared.module';
import { TouchedDirective } from '../../directives/touched/touched.directive';

import { PaymentCollectChargeComponent } from './payment-collect-charge/payment-collect-charge.component';
import { PaymentContactlessComponent } from './payment-contactless/payment-contactless.component';
import { PaymentChequeComponent } from './payment-cheque/payment-cheque.component';
import { PaymentPrintComponent } from './payment-print/payment-print.component';
import { PaymentPrintChargeComponent } from './payment-print-charge/payment-print-charge.component';
import { PaymentPatientInfoComponent } from './payment-patient-info/payment-patient-info.component';
import { PaymentOverallChargeComponent } from './payment-overall-charge/payment-overall-charge.component';
import { PaymentFollowUpComponent } from './payment-follow-up/payment-follow-up.component';
import { PaymentReferralComponent } from './payment-referral/payment-referral.component';
import { PaymentCoverageLimitComponent } from './payment-coverage-limit/payment-coverage-limit.component';
import { PaymentCollectMethodComponent } from './payment-collect-method/payment-collect-method.component';
import { PaymentMethodItemComponent } from './payment-collect-method/payment-method-item/payment-method-item.component';
import { PaymentCollectSummaryComponent } from './payment-collect-summary/payment-collect-summary.component';

@NgModule({
  imports: [CommonModule, SharedModule],
  exports: [
    PaymentOverallChargeComponent,
    PaymentCollectComponent,
    PaymentCollectChargeComponent,
    PaymentCollectMethodComponent,
    PaymentMethodItemComponent,
    PaymentCollectSummaryComponent,
    PaymentContactlessComponent,
    PaymentChequeComponent,
    PaymentPrintComponent,
    PaymentPrintChargeComponent,
    PaymentPatientInfoComponent,
    PaymentFollowUpComponent,
    PaymentReferralComponent,
    PaymentCoverageLimitComponent,
    PaymentMultiStepLayoutComponent
  ],
  declarations: [
    TouchedDirective,
    PaymentCollectChargeComponent,
    PaymentCollectMethodComponent,
    PaymentMethodItemComponent,
    PaymentCollectSummaryComponent,
    PaymentContactlessComponent,
    PaymentChequeComponent,
    PaymentPrintComponent,
    PaymentPrintChargeComponent,
    PaymentPatientInfoComponent,
    PaymentOverallChargeComponent,
    PaymentFollowUpComponent,
    PaymentReferralComponent,
    PaymentCoverageLimitComponent,
    PaymentCollectComponent,
    PaymentMultiStepLayoutComponent
  ]
})
export class PaymentComponentsModule {}
