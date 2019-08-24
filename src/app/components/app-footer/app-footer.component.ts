import { Component, OnInit } from '@angular/core';
import {} from '../';
@Component({
  selector: 'app-footer',
  templateUrl: './app-footer.component.html'
})
export class AppFooterComponent implements OnInit {
  version: string;

  constructor() {}

  ngOnInit() {
    const temp = require('../../../../package.json').version;
    // this.version = parseFloat(temp);
    this.version = temp;
  }
}
