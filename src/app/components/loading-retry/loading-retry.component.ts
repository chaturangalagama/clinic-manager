import { StoreService } from './../../services/store.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-retry',
  templateUrl: './loading-retry.component.html',
  styleUrls: ['./loading-retry.component.scss']
})
export class LoadingRetryComponent implements OnInit {
  constructor(private store: StoreService) {}

  ngOnInit() {}

  retry() {
    this.store.preInit();
  }
}
