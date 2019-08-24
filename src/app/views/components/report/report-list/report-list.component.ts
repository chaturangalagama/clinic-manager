import { report } from './../../../../model/Report';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.scss']
})
export class ReportListComponent implements OnInit {
  data = [];

  constructor() {}

  ngOnInit() {
    this.data = report;
  }
}
