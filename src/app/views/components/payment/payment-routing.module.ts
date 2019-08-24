import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';

import { PaymentCollectComponent } from './payment-collect/payment-collect.component';
import { CanDeactivateGuardService } from '../../../services/can-deactivate-guard.service';

export const redirectTo = () => {
  alert('Please check you have corresponding permission or not.');
  return 'login';
};

export const routes: Routes = [
  {
    path: '',
    canActivateChild: [NgxPermissionsGuard],
    data: {
      title: 'Payment'
    },
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'charge' },
      {
        path: 'charge',
        data: {
          requiresLogin: true,
          permissions: {
            only: ['ROLE_PATIENT_PAYMENT_CHECK', 'ROLE_BILL_PAYMENT'],
            redirectTo
          }
        },
        canDeactivate: [CanDeactivateGuardService],
      },
      {
        path: 'collect',
        component: PaymentCollectComponent,
        data: {
          requiresLogin: true,
          permissions: {
            only: ['ROLE_PATIENT_PAYMENT_CHECK', 'ROLE_BILL_PAYMENT'],
            redirectTo
          }
        },
        canDeactivate: [CanDeactivateGuardService],
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentRoutingModule { }
