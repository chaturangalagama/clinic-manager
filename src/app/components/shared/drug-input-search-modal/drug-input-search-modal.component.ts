import { BsModalRef } from 'ngx-bootstrap/modal';
import { AlertService } from './../../../services/alert.service';
import { ApiCmsManagementService } from './../../../services/api-cms-management.service';
import { FormControl } from '@angular/forms';
import { Component, OnInit, EventEmitter } from '@angular/core';
import { LoggerService } from '../../../services/logger.service';
import { distinctUntilChanged, debounceTime, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-drug-input-search-modal',
  templateUrl: './drug-input-search-modal.component.html',
  styleUrls: ['./drug-input-search-modal.component.scss']
})
export class DrugInputSearchModalComponent implements OnInit {
  public event: EventEmitter<any> = new EventEmitter();
  searchField: FormControl = new FormControl();
  rows = [];

  constructor(
    private apiCmsManagementService: ApiCmsManagementService,
    private logger: LoggerService,
    private alertService: AlertService,
    private bsModalRef: BsModalRef
  ) {}

  ngOnInit() {
    this.searchField.valueChanges
      .pipe(debounceTime(200), distinctUntilChanged((a, b) => {
        if (a !== b) {
          if (b.length === 0) {
            this.logger.info('hide select');
            this.rows = [];
            return true;
          }
          return false;
        }
        return false;
      }), switchMap(query => this.apiCmsManagementService.searchDrugs(query)))
      .subscribe(
        result => {
          if (result && result.payload && result.message === 'Success') {
            const { payload } = result;
            const temp2 = payload;
            this.rows = temp2;
          }
        },
        err => this.alertService.error(JSON.stringify(err.error.message))
      );
  }

  onSelect({ selected }) {
    this.bsModalRef.hide();
    console.log('Select Event', selected);
    this.event.emit(selected);
  }

  closeModal() {
    this.bsModalRef.hide();
  }
}
