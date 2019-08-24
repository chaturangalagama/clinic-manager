import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-add-appointment',
  templateUrl: './add-appointment.component.html',
  styleUrls: ['./add-appointment.component.scss']
})
export class AddAppointmentComponent implements OnInit {
  appointmentMinDate: Date;

  constructor() {
    this.appointmentMinDate = new Date();
  }

  ngOnInit() {}
}
