import { Component, OnInit } from '@angular/core';
import { ClaimChasComponent } from './../../../../components/claim/claim-chas/claim-chas.component';

@Component({
  selector: 'app-claim-list',
  templateUrl: './claim-list.component.html',
  styleUrls: ['./claim-list.component.scss']
})
export class ClaimListComponent implements OnInit {


  constructor() {
  }

  ngOnInit() {
    console.log("ClaimListComponent Init");
  }

}
