import { VitalService } from './../../../services/vital.service';
import { ApiPatientVisitService } from './../../../services/api-patient-visit.service';
import { StoreService } from './../../../services/store.service';
import { Component, Input, OnInit, ViewEncapsulation, EventEmitter, ViewChild, HostListener } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AlertService } from './../../../services/alert.service';
import { TabsetComponent } from 'ngx-bootstrap';
import { VitalTrendComponent } from './vital-trend/vital-trend.component';

@Component({
  moduleId: module.id,
  selector: 'app-vital',
  templateUrl: './vital.component.html',
  styleUrls: ['./vital.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VitalComponent implements OnInit {
  @Input() public vitalForm: FormGroup;
  @Input() exitGraph = new EventEmitter<boolean>();
  @ViewChild('vitalTabs') vitalTabs: TabsetComponent;
  trendRefresh: boolean;

  constructor(private alertService: AlertService, private vitalService: VitalService) {}

  ngOnInit() {
    this.vitalService.getPastVitals();
    console.log('Vitals Init');
  }

  // @HostListener('blur')
  // clickout(event) {
  //   // console.log('vitals===== >event: ', event);
  //   // if (this.eRef.nativeElement.contains(event.target)) {
  //   //   console.log('===== CLICKING INSIDE VITALS =======: ', event.target);
  //   // } else {
  //   //   console.log('event.target: ', event.target);
  //   //   // this.selectTab(0);
  //   // }
  // }

  selectTab(tab_id: number) {
    this.vitalTabs.tabs[tab_id].active = true;
  }

  onSelect($event) {
    this.trendRefresh = $event.heading === 'VITAL TRENDS' ? true : false;
  }
}
