import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-appointments-filter',
  templateUrl: './appointments-filter.component.html',
  styleUrls: ['./appointments-filter.component.scss']
})
export class AppointmentsFilterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  
  buttonClicked(){
    console.log("Update Calendar clicked");
  }
}
