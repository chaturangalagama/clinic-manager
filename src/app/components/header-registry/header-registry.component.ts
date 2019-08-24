import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header-registry',
  templateUrl: './header-registry.component.html',
  styleUrls: ['./header-registry.component.scss']
})
export class HeaderRegistryComponent implements OnInit {
  isCollapsed: true;
  status: { isopen: boolean } = { isopen: false };
  isOpen = false;
  constructor() {}

  ngOnInit() {}

  toggleIsopen(value: boolean) {
    console.log('TOGGLE VALUE', value);
    this.status.isopen = value;
  }

  change(value: boolean): void {
    this.status.isopen = value;
  }

  preventClose(event: MouseEvent) {
    event.stopImmediatePropagation();
  }
}
