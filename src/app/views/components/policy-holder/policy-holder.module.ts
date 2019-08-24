import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PolicyHolderRoutingModule } from './policy-holder-routing.module';
import { PolicyHolderAddComponent } from './policy-holder-add/policy-holder-add.component';
import { SharedModule } from '../../../shared.module';

@NgModule({
    imports: [CommonModule, PolicyHolderRoutingModule, SharedModule],
    declarations: [PolicyHolderAddComponent]
})
export class PolicyHolderModule {}
