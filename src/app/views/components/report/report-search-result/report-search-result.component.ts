import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-report-search-result',
  templateUrl: './report-search-result.component.html',
  styleUrls: ['./report-search-result.component.scss']
})
export class ReportSearchResultComponent implements OnInit {
  authToken: string;
  payload: any;
  reportSubmitAction: string;

  constructor() {
    this.authToken = `Bearer ${localStorage.getItem('access_token')}`;

    this.payload = JSON.stringify({ clinicIds: '', startDate: '2018-06-01', endDate: '2018-06-30' });

    this.reportSubmitAction = 'http://10.10.20.5:8080/reporting-ui/revenue_management_report';
  }

  ngOnInit() {}
}
