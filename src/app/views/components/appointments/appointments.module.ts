import { CalendarModule } from 'angular-calendar';
import { SharedModule } from './../../../shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppointmentsRoutingModule } from './appointments-routing.module';
import { AppointmentsOverviewComponent } from './appointments-overview/appointments-overview.component';
import { AppointmentsFilterComponent } from './appointments-filter/appointments-filter.component';
import { AppointmentsNewComponent } from './appointments-new/appointments-new.component';

// import {
//   CalendarEvent,
//   CalendarEventAction,
//   CalendarEventTimesChangedEvent,
//   CalendarView
// } from 'angular-calendar';

@NgModule({
  imports: [
    CommonModule,
    AppointmentsRoutingModule,
    SharedModule,
    CalendarModule
  ],
  declarations: [AppointmentsOverviewComponent, AppointmentsFilterComponent]
})
export class AppointmentsModule { }
