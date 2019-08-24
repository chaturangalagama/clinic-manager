import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VitalChartComponent } from './vital-chart/vital-chart.component';
import { VitalAddComponent } from './vital-add/vital-add.component';
import { VitalTableComponent } from './vital-table/vital-table.component';
import { SharedModule } from '../../shared.module';
import { VitalAddItemComponent } from './vital-add/vital-add-item/vital-add-item.component';
import { VitalContainerComponent } from './vital-container/vital-container.component';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [],
  exports: [],
  entryComponents: []
})
export class VitalModule {}
