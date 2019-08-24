import { LoggerService } from './../../../services/logger.service';
import { ApiCmsManagementService } from './../../../services/api-cms-management.service';
import { FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Component, OnInit, ViewChild, forwardRef } from '@angular/core';
import { distinctUntilChanged, debounceTime, switchMap } from 'rxjs/operators';

export const EPANDED_TEXTAREA_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DrugInputSearchComponent),
  multi: true
};

@Component({
  selector: 'app-drug-input-search',
  providers: [EPANDED_TEXTAREA_VALUE_ACCESSOR],
  templateUrl: './drug-input-search.component.html',
  styleUrls: ['./drug-input-search.component.scss']
})
export class DrugInputSearchComponent implements OnInit, ControlValueAccessor {
  @ViewChild('filterSelect') filterSelect;

  queryField: FormControl = new FormControl();
  results: any[] = [];
  isSearchMode = false;

  onChange;
  onTouched;

  constructor(private apiCmsManagementService: ApiCmsManagementService, private logger: LoggerService) {}

  ngOnInit() {
    this.queryField.valueChanges
      .pipe(debounceTime(200), distinctUntilChanged((a, b) => {
        if (a !== b) {
          if (b.length === 0 || b.length < 2) {
            this.logger.info('hide select');
            this.showHideFilterSelect();
            this.results = [];
            return true;
          }
          return false;
        }
        return false;
      }), switchMap(query => this.apiCmsManagementService.searchDrugs(query)))
      .subscribe(result => {
        if (result && result.payload && result.message === 'Success') {
          this.showHideFilterSelect();

          this.results = result.payload;
          if (result.payload.length < 1 && this.isSearchMode) {
            this.results = [{ code: 'No Data...' }];
          }
        }
      });
  }

  onInputClicked(event) {
    this.isSearchMode = true;
  }

  onItemSelected(item) {
    this.logger.info('Selected Item', item);
    this.showHideFilterSelect();
    this.queryField.patchValue(item.code);

    this.isSearchMode = false;
  }

  showHideFilterSelect() {
    document.querySelector('#filterSelect').classList.toggle('filter-select-visible');
  }

  writeValue(obj: any): void {
    // this.queryField = obj;
    this.logger.info('ITEM OBJ', obj);
    this.queryField.patchValue(obj);
  }
  registerOnChange(fn: any): void {
    this.logger.info('component onChange', fn);
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = this.onItemSelected('a');
  }
  setDisabledState?(isDisabled: boolean): void {}
}
