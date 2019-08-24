import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { timer } from 'rxjs';

@Component({
  moduleId: module.id.toString(),
  selector: 'alert',
  templateUrl: 'alert.component.html'
})
export class AlertComponent {
  message: any;
  errorMessages: Array<String>;

  constructor(private alertService: AlertService) { }

  ngOnInit() {
    this.alertService.getMessage().subscribe(message => {
      this.message = message;

      const source = timer(10000);
      // hide message
      const subscribe = source.subscribe(val => this.toggleHide());
    });
  }

  toggleHide() {
    const elementClickedOn = document.getElementById('alert');
    this.message = '';
  }
}
