import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-simple-error',
  templateUrl: './simple-error.component.html',
  styleUrls: ['./simple-error.component.scss']
})
export class SimpleErrorComponent implements OnInit {
  @Input() errors: Array<string>;

  constructor() {}

  ngOnInit() {}

  showErrors() {
    return this.errors.length > 0;
  }
}
