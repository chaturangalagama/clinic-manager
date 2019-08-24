import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';

import { PolicyHolderAddComponent } from './policy-holder-add/policy-holder-add.component';

const routes: Routes = [
    {
        path: '',
        canActivate: [NgxPermissionsGuard],
        data: {
            title: 'Policy Holder',
            permissions: {
                only: [
                    "ROLE_MEDICAL_MANAGE_POLICY_HOLDER",
                ],
            },
        },
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'add' },
            {
                path: 'add',
                component: PolicyHolderAddComponent
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PolicyHolderRoutingModule { }
