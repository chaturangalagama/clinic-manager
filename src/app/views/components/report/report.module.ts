import { SharedModule } from './../../../shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';
import { ReportListComponent } from './report-list/report-list.component';
import { ReportSearchComponent } from './report-search/report-search.component';
import { ReportSearchResultComponent } from './report-search-result/report-search-result.component';

@NgModule({
  imports: [CommonModule, SharedModule, ReportRoutingModule],
  declarations: [ReportListComponent, ReportSearchComponent, ReportSearchResultComponent]
})
export class ReportModule {}
