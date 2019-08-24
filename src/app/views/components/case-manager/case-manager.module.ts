import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared.module';
import { CaseManagerRoutingModule } from './case-manager-routing.module';
import { CaseManagerListComponent } from './case-manager-list/case-manager-list.component';
import { CaseDetailsComponent } from './case-manager-details/case-details.component';
import { CaseManagerComponentsModule } from '../../../components/case-manager/case-manager-componenets.module';

@NgModule({
  imports: [
    CaseManagerRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CaseManagerComponentsModule
  ],
  declarations: [CaseManagerListComponent, CaseDetailsComponent]
})
export class CaseManagerModule {}
